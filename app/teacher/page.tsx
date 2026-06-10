"use client";

import { TeacherLayout } from "@/components/teacher-layout";
import { ActiveExam, Exam, Student } from "@/lib/exam-layout";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function Home() {
  // Refs keep connection/session objects available without causing re-renders.
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const rosterRef = useRef<string[]>([]);
  const [examCode, setExamCode] = useState<string | null>(null);
  const [roster, setRoster] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
      setExamCode(createdExamCode);
      socket.emit("exam:updateroster", createdExamCode, rosterRef.current);
    });

    socket.on("exam:update", (activeExam: ActiveExam) => {
      rosterRef.current = activeExam.roster;
      setRoster(activeExam.roster);
      setStudents(activeExam.students);
    });

    return () => {
      // Avoid keeping stale socket event handlers alive after leaving /teacher.
      socket.disconnect();
      socketRef.current = null;
      examCodeRef.current = null;
      rosterRef.current = [];
      setExamCode(null);
      setRoster([]);
      setStudents([]);
    };
  }, []);

  function updateExam(newExam: Exam) {
    console.log("Updating exam:", newExam);
    const currentStatus = exam.status;
    const nextStatus = newExam.status;
    const examCode = examCodeRef.current;

    // Status transitions are the client-side trigger for server exam events.
    if (currentStatus === "setup" && nextStatus === "waiting") {
      console.log("Creating exam on server...");
      socketRef.current?.emit("exam:create", newExam, rosterRef.current);
    }

    if (currentStatus === "waiting" && nextStatus === "live") {
      console.log("Starting exam on server...");
      socketRef.current?.emit("exam:start", examCode, newExam);
    }

    if (currentStatus === "live" && nextStatus === "waiting") {
      console.log("Setting exam back to waiting...");
      socketRef.current?.emit("exam:setback", examCode);
    }

    if (currentStatus === "waiting" && nextStatus === "setup") {
      console.log("Returning exam to setup...");
      socketRef.current?.emit("exam:setup", examCode);
      examCodeRef.current = null;
      setExamCode(null);
      setStudents([]);
    }

    if (currentStatus === "live" && nextStatus === "terminated") {
      console.log("Terminating exam on server...");
      socketRef.current?.emit("exam:terminate", examCode, "manual");
    }

    if (
      examCode &&
      currentStatus === "waiting" &&
      nextStatus !== "setup"
    ) {
      socketRef.current?.emit("exam:update", examCode, newExam);
    }

    setExam(newExam);
  }

  function addRosterName(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nextRoster = Array.from(new Set([...rosterRef.current, trimmedName]));
    const currentExamCode = examCodeRef.current ?? examCode;

    rosterRef.current = nextRoster;
    setRoster(nextRoster);

    if (currentExamCode) {
      console.log("Updating roster on server:", currentExamCode, nextRoster);
      socketRef.current?.emit("exam:updateroster", currentExamCode, nextRoster);
    } else {
      console.log("Roster updated locally before exam code exists:", nextRoster);
    }
  }

  return (
    <TeacherLayout
      exam={exam}
      examCode={examCode}
      roster={roster}
      students={students}
      updateExam={updateExam}
      onAddRosterName={addRosterName}
    />
  );
}
