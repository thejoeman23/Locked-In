import { createServer } from "http";
import { Server } from "socket.io";
import type { ActiveExam, Student } from "../lib/exam-layout.ts";
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

    socket.on("exam:update", (exam) => {
        console.log("Exam updated:", exam);
    });

    socket.on("exam:terminate", (examId) => {
        console.log("Terminating exam:", examId);

        // Removing the exam prevents new joins and acts as the final lifecycle state.
        activeExams.delete(examId);
        socket.to(examId).emit("exam:terminated");
    });

    socket.on("exam:start", (examId) => {
        console.log("Starting exam:", examId);
        const exam = activeExams.get(examId);
        if (exam) {
            socket.to(examId).emit("exam:started");
        } else {
            console.warn(`Exam with ID ${examId} not found for starting`);
        }
    });

    socket.on("exam:create", (exam, roster) => {
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

    socket.on("exam:search", (examId) => {
        // Lets the student page validate a code before committing to a join.
        const exam = activeExams.get(examId);
        if (exam) {
            socket.emit("exam:found", exam);
        } else {
            socket.emit("exam:notfound");
        }
    });

    socket.on("exam:join", (examId, name) => {
        const exam = activeExams.get(examId);
        if (exam) {
            // Rejoin logic should eventually match on a persistent student id,
            // not socket.id, because socket ids change after reconnects.
            const student: Student = {
                socket: socket.id,
                name,
                uniqueExam: exam.exam,
                status: "connected"
            };
            exam.students.push(student);
            socket.join(examId);
            io.to(examId).emit("exam:update", exam);
            console.log(`Registered student ${name} with ID ${socket.id} to exam ${examId}`);
        } else {
            console.warn(`Exam with ID ${examId} not found for registration of student ${name}`);
        }
    });
});

httpServer.listen(3001, () => {
    console.log("Socket server listening on http://localhost:3001");
});
