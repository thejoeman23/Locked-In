import { createServer } from "http";
import { Server } from "socket.io";
import type { ActiveExam, Exam, Roster, Student, TerminationTerms } from "../lib/exam-layout.ts";
import { generateExamCode } from "../lib/utils.ts";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        // Development-friendly CORS. Tighten this to the app origin before production.
        origin: "*"
    }
});

// In-memory exam registry. This resets when the server restarts and only works
// for a single server instance; use a database/Redis when sessions must survive.
const activeExams: Map<string, ActiveExam> = new Map();

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Teacher events.
    socket.on("exam:create", (exam: Exam, roster: Roster) => {
        console.log("Creating exam:", exam);

        // The generated code is both the student-facing join code and socket room id.
        const examCode = generateExamCode(activeExams);
        const newActiveExam: ActiveExam = {
            exam,
            students: [],
            roster
        };

        activeExams.set(
            examCode,
            newActiveExam
        );

        socket.join(examCode);
        socket.emit(
            "exam:created",
            examCode
        );
        socket.emit("exam:update", newActiveExam);
    });

    socket.on("exam:update", (examId: string, exam: Exam) => {
        const activeExam = activeExams.get(examId);
        if (!activeExam) {
            console.warn(`Exam with ID ${examId} not found for teacher update`);
            return;
        }

        activeExam.exam = exam;
    });

    socket.on("exam:updateroster", (examId: string, roster: Roster) => {
        const activeExam = activeExams.get(examId);
        if (!activeExam) {
            console.warn(`Exam with ID ${examId} not found for roster update`);
            return;
        }

        socket.join(examId);
        activeExam.roster = roster;
        io.to(examId).emit("exam:update", activeExam);
        console.log(`Updated roster for exam ${examId}:`, activeExam.roster);
    });

    socket.on("exam:rejointeacher", (examId: string) => {
        const activeExamEntry = Array.from(activeExams.entries()).find(([, activeExam]) => activeExam.exam.id === examId);
        if (!activeExamEntry) {
            socket.emit("exam:examnotfound");
            console.warn(`Teacher attempted to rejoin an exam with the id of ${examId}, but it was not an active exam.`);
            return;
        }

        const [examCode, activeExam] = activeExamEntry;

        if (!socket.rooms.has(examCode)) {
            socket.join(examCode);
            console.log(`Teacher has regained control of exam ${examCode}`);
        } else {
            console.log(`Teacher already controls exam ${examCode}`);
        }

        socket.emit("exam:teacherrejoined", examCode, activeExam);
    });

    socket.on("exam:kickstudent", (examId: string, name: string) => {
        const normalizedName = normalizeStudentName(name);
        const activeExam = activeExams.get(examId);
        if (!activeExam) {
            console.warn(`Exam with ID ${examId} not found for kicking student ${normalizedName}`);
            return;
        }

        const student = activeExam.students.find((student) => student.name === normalizedName);
        if (!student) {
            console.warn(`Student ${normalizedName} not found in exam ${examId} for kick`);
            return;
        }

        io.to(student.socket).emit("exam:kicked");
        io.sockets.sockets.get(student.socket)?.leave(examId);
        activeExam.students = activeExam.students.filter((student) => student.name !== normalizedName);
        io.to(examId).emit("exam:update", activeExam);
        console.log(`Kicked student ${normalizedName} from exam ${examId}`);
    });

    socket.on("exam:start", (examId: string, latestExam?: Exam) => {
        console.log("Starting exam:", examId);
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            if (latestExam) {
                activeExam.exam = latestExam;
            }

            if (!activeExam.exam) {
                console.warn(`Exam with ID ${examId} has no exam payload to start`);
                return;
            }

            console.log("Exam started:", JSON.stringify(activeExam.exam));
            io.to(examId).emit("exam:started", activeExam.exam);
        } else {
            console.warn(`Exam with ID ${examId} not found for starting`);
        }
    });

    socket.on("exam:terminate", (examId: string, terms: TerminationTerms) => {
        console.log("Terminating exam:", examId);
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            activeExam.exam.status = "setup";
        }
        socket.to(examId).emit("exam:requested");
        setTimeout(() => {
            socket.to(examId).emit("exam:terminated", terms);
            activeExams.delete(examId);
        })

        console.log(activeExams);
    });

    socket.on("exam:setup", (examId: string) => {
        console.log("Returning exam to setup:", examId);

        activeExams.delete(examId);
        socket.to(examId).emit("exam:setup");
    });

    socket.on("exam:preterminate", (examId: string) => {
        console.log("Pre-terminating exam:", examId);
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            activeExam.exam.status = "setup";
            io.to(examId).emit("exam:preterminated");
            activeExams.delete(examId);
        } else {
            console.warn(`Exam with ID ${examId} not found for pre-termination`);
        }
    });

    socket.on("exam:setback", (examId: string) => {
        console.log("Setting back exam:", examId);
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            activeExam.exam.status = "waiting";
            activeExam.students.forEach((student) => {
                student.completed = false;
                student.uniqueExam = activeExam.exam;
            });
            io.to(examId).emit("exam:update", activeExam);
            io.to(examId).emit("exam:setback", activeExam.exam);
        } else {
            console.warn(`Exam with ID ${examId} not found for setback`);
        }
    });

    // Student events.
    socket.on("exam:search", (examId: string) => {
        // Lets the student page validate a code before committing to a join.
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            socket.emit("exam:found");
        } else {
            socket.emit("exam:notfound");
        }
    });

    socket.on("exam:join", (examId: string, name: string, isRejoin = false) => {
        const normalizedName = normalizeStudentName(name);
        const activeExam = activeExams.get(examId);

        if (!activeExam) {
            socket.emit("exam:notfound");
            console.warn(`Exam with ID ${examId} not found for registration of student ${normalizedName}`);
            return;
        }

        if (!activeExam.roster.names.includes(normalizedName)) {
            socket.emit("exam:invalidname");
            return;
        }

        const existingStudent = activeExam.students.find((student) => student.name === normalizedName);

        if (existingStudent?.connected && !isRejoin) {
            socket.emit("exam:nameinuse");
            return;
        }

        if (existingStudent?.completed === true) {
            socket.emit("exam:alreadycompleted");
            return;
        }

        socket.join(examId);

        if (existingStudent) {
            if (existingStudent.connected && existingStudent.socket !== socket.id) {
                io.sockets.sockets.get(existingStudent.socket)?.leave(examId);
            }

            existingStudent.socket = socket.id;
            existingStudent.connected = true;
            io.to(examId).emit("exam:update", activeExam);
            console.log(`Reconnected student ${normalizedName} with ID ${socket.id} to exam ${examId}`);
            
            if (activeExam.exam.status === "live") {
                socket.emit("exam:started", existingStudent.uniqueExam);
            } else {
                socket.emit("exam:joined");
            }

            return;
        }

        const student: Student = {
            socket: socket.id,
            name: normalizedName,
            uniqueExam: activeExam.exam,
            connected: true,
            completed: false
        };

        activeExam.students.push(student);
        io.to(examId).emit("exam:update", activeExam);

        if (activeExam.exam.status === "live") {
            socket.emit("exam:started", student.uniqueExam);
        } else {
            socket.emit("exam:joined");
        }

        console.log(`Registered student ${normalizedName} with ID ${socket.id} to exam ${examId}`);
    });

    socket.on("exam:sync", (uniqueExam: Exam, examID: string) => {
        const activeExam = activeExams.get(examID);
        if (!activeExam) {
            console.warn(`Exam with ID ${examID} not found for update`);
            return;
        }

        const student = activeExam.students.find((student) => student.socket === socket.id);
        if (!student) {
            console.warn(`Student with socket ID ${socket.id} not found in exam ${examID} for update`);
            return;
        }
        
        // This simple implementation trusts the client to send a valid exam structure.
        // A more robust implementation would validate/sanitize this input and handle errors.
        student.uniqueExam = uniqueExam;
        socket.emit("exam:synced");
        console.log(`Received exam update from student ${student.name} in exam ${examID}`);
    });

    socket.on("exam:submit", (uniqueExam: Exam, examID: string) => {
        const activeExam = activeExams.get(examID);
        if (!activeExam) {
            console.warn(`Exam with ID ${examID} not found for submission`);
            return;
        }

        const student = activeExam.students.find((student) => student.socket === socket.id);
        if (!student) {
            console.warn(`Student with socket ID ${socket.id} not found in exam ${examID} for submission`);
            return;
        }

        student.completed = true;
        socket.emit("exam:submitted");
        io.to(examID).emit("exam:update", activeExam);

        // In a real implementation, you'd likely want to persist this submission and trigger grading.
        console.log(`Received exam submission from student ${student.name} in exam ${examID}`);
    });

    socket.on("exam:disconnect", (examID: string) => {
        disconnectStudent(socket.id, examID);
    });

    socket.on("disconnect", () => {
        disconnectStudent(socket.id);
    });
});

httpServer.listen(3001, () => {
    console.log("Socket server listening on http://localhost:3001");
});

function disconnectStudent(socketId: string, examID?: string) {
    if (examID) {
        const activeExam = activeExams.get(examID);
        if (!activeExam) {
            console.warn(`Exam with ID ${examID} not found for student disconnect`);
            return;
        }

        const student = activeExam.students.find((student) => student.socket === socketId);
        if (!student) {
            console.warn("Student does not exist so cannot disconnect.");
            return;
        }

        student.connected = false;
        io.to(examID).emit("exam:update", activeExam);
        console.log(`Disconnected student ${student.name} from exam ${examID}`);
        return;
    }

    for (const [activeExamId, activeExam] of activeExams.entries()) {
        const student = activeExam.students.find((student) => student.socket === socketId);
        if (!student) {
            continue;
        }

        student.connected = false;
        io.to(activeExamId).emit("exam:update", activeExam);
        console.log(`Disconnected student ${student.name} from exam ${activeExamId}`);
        return;
    }
}

function normalizeStudentName(name: string) {
    return name.trim().replace(/\s+/g, " ").toUpperCase();
}
