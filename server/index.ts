import { createServer } from "http";
import { Server } from "socket.io";
import type { ActiveExam, Exam, Student } from "../lib/exam-layout.ts";
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

        // In a real implementation, you'd likely want to persist this submission and trigger grading.
        console.log(`Received exam submission from student ${student.name} in exam ${examID}`);
    });

    socket.on("exam:terminate", (examId: string) => {
        console.log("Terminating exam:", examId);

        // Removing the exam prevents new joins and acts as the final lifecycle state.
        activeExams.delete(examId);
        socket.to(examId).emit("exam:terminated");
    });

    socket.on("exam:start", (examId: string) => {
        console.log("Starting exam:", examId);
        const exam = activeExams.get(examId);
        if (exam) {
            socket.to(examId).emit("exam:started");
        } else {
            console.warn(`Exam with ID ${examId} not found for starting`);
        }
    });

    socket.on("exam:create", (exam: Exam, roster: string[]) => {
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
    });

    socket.on("exam:search", (examId: string) => {
        // Lets the student page validate a code before committing to a join.
        const activeExam = activeExams.get(examId);
        if (activeExam) {
            socket.emit("exam:found");
        } else {
            socket.emit("exam:notfound");
        }
    });

    socket.on("exam:join", (examId: string, name: string) => {
        const activeExam = activeExams.get(examId);

        if (!activeExam) {
            socket.emit("exam:notfound");
            console.warn(`Exam with ID ${examId} not found for registration of student ${name}`);
            return;
        }

        if (!activeExam.roster.includes(name)) {
            socket.emit("exam:invalidname");
            return;
        }

        const existingStudent = activeExam.students.find((student) => student.name === name);

        if (existingStudent?.connected) {
            socket.emit("exam:nameinuse");
            return;
        }

        socket.join(examId);

        if (existingStudent) {
            existingStudent.socket = socket.id;
            existingStudent.connected = true;
            socket.emit("exam:joined", existingStudent.uniqueExam);
            io.to(examId).emit("exam:update", activeExam);
            console.log(`Reconnected student ${name} with ID ${socket.id} to exam ${examId}`);
            
            return;
        }

        const student: Student = {
            socket: socket.id,
            name,
            uniqueExam: activeExam.exam,
            connected: true
        };

        activeExam.students.push(student);
        socket.emit("exam:joined", student.uniqueExam);
        io.to(examId).emit("exam:update", activeExam);
        console.log(`Registered student ${name} with ID ${socket.id} to exam ${examId}`);
    });

    socket.on("disconnect", () => {
        for (const [examId, activeExam] of activeExams) {
            const student = activeExam.students.find((student) => student.socket === socket.id);

            if (!student) {
                continue;
            }

            student.connected = false;
            io.to(examId).emit("exam:update", activeExam);
            console.log(`Disconnected student ${student.name} from exam ${examId}`);
            return;
        }
    });
});

httpServer.listen(3001, () => {
    console.log("Socket server listening on http://localhost:3001");
});
