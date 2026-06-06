"use client";

import { Exam } from "@/lib/exam-layout";
import { TeacherInput } from "@/components/teacher-input";
import { TeacherButton } from "@/components/teacher-button";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function Home() {
  // Refs keep connection/session objects available without causing re-renders.
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const [exam, setExam] = useState<Exam>({
    title: "",
    status: "setup",
    content: []
  });

  useEffect(() => {
    // The teacher owns a single socket connection for this page session.
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Exam socket connection failed:", error.message);
    });

    socket.on("exam:created", (createdExamCode) => {
      console.log("Exam created with code:", createdExamCode);
      examCodeRef.current = createdExamCode;
    });

    return () => {
      // Avoid keeping stale socket event handlers alive after leaving /teacher.
      socket.disconnect();
      socketRef.current = null;
      examCodeRef.current = null;
    };
  }, []);

  function updateExam(newExam: Exam) {
    console.log("Updating exam:", newExam);

    // Status transitions are the client-side trigger for server exam events.
    if (exam.status === "setup" && newExam.status === "waiting") {
      console.log("Creating exam on server...");
      socketRef.current?.emit("exam:create", newExam, []);
    }

    if (exam.status === "waiting" && newExam.status === "live") {
      console.log("Starting exam on server...");
      socketRef.current?.emit("exam:start", examCodeRef.current);
    }

    if (exam.status === "live" && newExam.status === "terminated") {
      console.log("Terminating exam on server...");
      socketRef.current?.emit("exam:terminate", examCodeRef.current);
    }

    setExam(newExam);
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <TeacherInput exam={exam} updateExam={updateExam} />
      <TeacherButton exam={exam} updateExam={updateExam} className="w-full max-w-sm" variant="outline"/>
    </main>
  );
}
