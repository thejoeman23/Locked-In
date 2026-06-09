"use client";

import { StudentLayout } from "@/components/student-layout";

import { Exam, StudentStatus } from "@/lib/exam-layout";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

type ExamSocketPayload = Exam | { exam?: Exam } | undefined;

function readExamPayload(payload: ExamSocketPayload) {
  if (!payload) {
    return null;
  }

  return "content" in payload ? payload : payload.exam ?? null;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const errorAlertRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<StudentStatus>("join-code");
  const [exam, setExam] = useState<Exam | null>(null);

  function setStudentError(message: string | null) {
    errorAlertRef.current = message;
    setErrorMessage(message);
  }

  useEffect(() => {
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStudentError(null);
      console.log("Connected to socket:", socket.id);
    });

    socket.on("connect_error", (error) => {
      setStudentError("Unable to connect to the exam server. Please check your connection and try again.");
      console.error("Exam socket connection failed:", error.message);
    });

    socket.on("exam:found", () => {
      setStudentError(null);
      setStatus("enter-name");
      console.log("Exam found with code:", examCodeRef.current);
    });

    socket.on("exam:notfound", () => {
      setStatus("join-code");
      setStudentError("No exam found with that code. Please check the code and try again.");
      console.warn("Exam not found with code:", examCodeRef.current);
    });

    socket.on("exam:invalidname", () => {
      setStudentError("The name you entered is invalid for this exam.");
      console.warn("Invalid name for exam with code:", examCodeRef.current);
    });

    socket.on("exam:nameinuse", () => {
      setStudentError("The name you entered is already in use for this exam.");
      console.warn("Name already in use for exam with code:", examCodeRef.current);
    });

    socket.on("exam:joined", () => {
      setStudentError(null);
      setStatus("waiting");
      console.log("Joined exam with unique code:", examCodeRef.current);
    });

    function receiveStartedExam(payload: ExamSocketPayload) {
      const uniqueExam = readExamPayload(payload);

      if (!uniqueExam) {
        setStudentError("The exam started, but no exam content was received. Trying to load it again.");
        console.warn("Exam started without an exam payload:", payload);
        socket.emit("exam:load", examCodeRef.current);
        return;
      }

      setStudentError(null);
      setExam(uniqueExam);
      setStatus("taking-exam");
      console.log("Exam started:", JSON.stringify(uniqueExam));
    }

    socket.on("exam:started", (payload: ExamSocketPayload) => {
      receiveStartedExam(payload);
    });

    socket.on("exam:loaded", (payload: ExamSocketPayload) => {
      receiveStartedExam(payload);
    });

    socket.on("exam:synced", () => {
      console.log("Exam synced");
    });

    socket.on("exam:submitted", () => {
      setStatus("finished");
      console.log("Exam submitted");
    });

    socket.on("exam:terminated", () => {
      setStatus("finished");
      console.log("Exam terminated");
    });

    socket.on("exam:preterminated", () => {
      setStatus("join-code");
      setStudentError("The exam has been pre-terminated by the teacher. Please wait for further instructions.");
      console.log("Exam pre-terminated");
    });

    socket.on("exam:setback", (uniqueExam: Exam) => {
      setStatus("waiting");
      setExam(uniqueExam);
      setStudentError("The exam has been reset. Please wait for further instructions.");
      console.log("Exam setback");
    });

    return () => {
      // Avoid keeping stale socket event handlers alive after leaving /teacher.
      socket.disconnect();
      socketRef.current = null;
      examCodeRef.current = null;
      errorAlertRef.current = null;
    };
  }, []);

  function searchForExam(code: string) {
    setStudentError(null);
    examCodeRef.current = code;
    console.log("Searching for exam with code:", examCodeRef.current);
    socketRef.current?.emit("exam:search", examCodeRef.current);
  }

  function joinExam(name: string) {
    setStudentError(null);
    console.log(`Attempting to join exam with code: ${examCodeRef.current} and name: ${name}`);
    socketRef.current?.emit("exam:join", examCodeRef.current, name);
  }

  function syncExam() {
    if (!exam) {
      console.warn("No exam to sync");
      return;
    }
    console.log("Syncing exam with code:", examCodeRef.current);
    socketRef.current?.emit("exam:sync", exam, examCodeRef.current);
  }

  function submitExam() {
    if (!exam) {
      console.warn("No exam to submit");
      return;
    }
    console.log("Submitting exam with code:", examCodeRef.current);
    socketRef.current?.emit("exam:submit", exam, examCodeRef.current);
  }

  function updateExam(updatedExam: Exam) {
    setExam(updatedExam);
  }

  return (
    <StudentLayout 
      exam={exam}
      status={status}
      errorMessage={errorMessage}
      updateExam={updateExam}
      syncExam={syncExam}
      searchForExam={searchForExam}
      joinExam={joinExam}
      submitExam={submitExam}
    />
  );
}
