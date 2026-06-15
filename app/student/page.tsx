"use client";

import { StudentLayout } from "@/components/student/student-layout";

import { Exam, StudentFinishReason, StudentStatus, TerminationTerms } from "@/lib/exam-layout";
import { localStudentStorage } from "@/lib/local-student-storage";
import { StudentStorageState } from "@/lib/student-storage";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const studentNameRef = useRef<string | null>(null);
  const errorAlertRef = useRef<string | null>(null);
  const statusRef = useRef<StudentStatus>("join-code");
  const examRef = useRef<Exam | null>(null);
  const pendingStudentRef = useRef<StudentStorageState | null>(null);
  const autoRejoinAttemptedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<StudentStatus>("join-code");
  const [finishReason, setFinishReason] = useState<StudentFinishReason>("submitted");
  const [exam, setExam] = useState<Exam | null>(null);

  function setStudentError(message: string | null) {
    errorAlertRef.current = message;
    setErrorMessage(message);
  }

  function clearSavedStudent() {
    pendingStudentRef.current = null;
    localStudentStorage.clearStudent();
  }

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    examRef.current = exam;
  }, [exam]);

  useEffect(() => {
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStudentError(null);
      console.log("Connected to socket:", socket.id);

      if (!autoRejoinAttemptedRef.current && pendingStudentRef.current) {
        autoRejoinAttemptedRef.current = true;
        const savedStudent = pendingStudentRef.current;
        examCodeRef.current = savedStudent.examCode;
        studentNameRef.current = savedStudent.studentName;
        setStatus("waiting");
        socket.emit("exam:join", savedStudent.examCode, savedStudent.studentName, true);
      }
    });

    // Error events.
    socket.on("connect_error", (error) => {
      setStudentError("Unable to connect to the exam server. Please check your connection and try again.");
      console.error("Exam socket connection failed:", error.message);
    });

    socket.on("exam:notfound", () => {
      examCodeRef.current = null;
      studentNameRef.current = null;
      clearSavedStudent();
      setStatus("join-code");
      setStudentError("No exam found with that code. Please check the code and try again.");
      console.warn("Exam not found with code:", examCodeRef.current);
    });

    socket.on("exam:invalidname", () => {
      clearSavedStudent();
      setStudentError("The name you entered is invalid for this exam.");
      console.warn("Invalid name for exam with code:", examCodeRef.current);
    });

    socket.on("exam:nameinuse", () => {
      setStudentError("The name you entered is already in use for this exam.");
      console.warn("Name already in use for exam with code:", examCodeRef.current);
    });

    socket.on("exam:kicked", () => {
      examCodeRef.current = null;
      studentNameRef.current = null;
      clearSavedStudent();
      setExam(null);
      setStatus("join-code");
      setStudentError("Your teacher removed you from this exam.");
      console.warn("Student was removed from exam");
    });

    socket.on("exam:alreadycompleted", () => {
      examCodeRef.current = null;
      studentNameRef.current = null;
      clearSavedStudent();
      setStatus("join-code");
      setStudentError("You have already completed this exam.");
      console.warn("Student attempted to join an exam they have already completed with code:", examCodeRef.current);
    });

    // Chronological exam flow.
    socket.on("exam:found", () => {
      setStudentError(null);
      setStatus("enter-name");
      console.log("Exam found with code:", examCodeRef.current);
    });

    socket.on("exam:joined", () => {
      setStudentError(null);
      setStatus("waiting");
      if (examCodeRef.current && studentNameRef.current) {
        localStudentStorage.saveStudent({
          examCode: examCodeRef.current,
          studentName: studentNameRef.current
        });
      }
      console.log("Joined exam with unique code:", examCodeRef.current);
    });

    socket.on("exam:started", (uniqueExam: Exam) => {
      setStudentError(null);
      setExam(uniqueExam);
      setStatus("taking-exam");
      if (examCodeRef.current && studentNameRef.current) {
        localStudentStorage.saveStudent({
          examCode: examCodeRef.current,
          studentName: studentNameRef.current
        });
      }
      console.log("Exam started:", JSON.stringify(uniqueExam));
    });

    socket.on("exam:submitted", () => {
      setFinishReason("submitted");
      setStatus("finished");
      console.log("Exam submitted");
      socketRef.current?.emit("exam:disconnect", examCodeRef.current);
      clearSavedStudent();
    });

    // Sync/support events.
    socket.on("exam:requested", () => {
      if (statusRef.current !== "taking-exam") return;
      if (!examRef.current) {
        console.warn("Exam requested but no exam is currently loaded");
        return;
      }
      console.log("Exam content requested by teacher, syncing current exam state");
      socket.emit("exam:sync", examRef.current, examCodeRef.current);
    });

    socket.on("exam:synced", () => {
      console.log("Exam synced");
    });

    // Termination/reset events.
    socket.on("exam:terminated", (terms: TerminationTerms) => {
      setFinishReason(terms);
      setStatus("finished");
      socketRef.current?.emit("exam:disconnect", examCodeRef.current);
      clearSavedStudent();
    });

    socket.on("exam:setup", () => {
      socketRef.current?.emit("exam:disconnect", examCodeRef.current);
      examCodeRef.current = null;
      studentNameRef.current = null;
      clearSavedStudent();
      setStatus("join-code");
      setExam(null);
      setStudentError("The teacher returned the exam to setup. Please wait for a new code.");
      console.log("Exam returned to setup");
    });

    socket.on("exam:preterminated", () => {
      socketRef.current?.emit("exam:disconnect", examCodeRef.current);
      examCodeRef.current = null;
      studentNameRef.current = null;
      clearSavedStudent();
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

    localStudentStorage.getStudent().then((savedStudent) => {
      if (!savedStudent || autoRejoinAttemptedRef.current) {
        return;
      }

      pendingStudentRef.current = savedStudent;
      if (socket.connected) {
        autoRejoinAttemptedRef.current = true;
        examCodeRef.current = savedStudent.examCode;
        studentNameRef.current = savedStudent.studentName;
        setStatus("waiting");
        socket.emit("exam:join", savedStudent.examCode, savedStudent.studentName, true);
      }
    });

    function disconnectStudent() {
      if (examCodeRef.current) {
        socket.emit("exam:disconnect", examCodeRef.current);
      }
      socket.disconnect();
    }

    window.addEventListener("beforeunload", disconnectStudent);

    return () => {
      window.removeEventListener("beforeunload", disconnectStudent);
      disconnectStudent();
      socketRef.current = null;
      examCodeRef.current = null;
      studentNameRef.current = null;
      errorAlertRef.current = null;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(syncExam, 5000); // Sync every 30 seconds.
    function syncExam() {
      if (!exam) {
        return;
      }
      console.log("Syncing exam with code:", examCodeRef.current);
      socketRef.current?.emit("exam:sync", exam, examCodeRef.current);
    }

    return () => clearInterval(interval);
  }, [exam]);

  function searchForExam(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    setStudentError(null);
    examCodeRef.current = normalizedCode;
    studentNameRef.current = null;
    console.log("Searching for exam with code:", examCodeRef.current);
    socketRef.current?.emit("exam:search", examCodeRef.current);
  }

  function joinExam(name: string) {
    const normalizedName = name.trim().replace(/\s+/g, " ").toUpperCase();
    setStudentError(null);
    studentNameRef.current = normalizedName;
    console.log(`Attempting to join exam with code: ${examCodeRef.current} and name: ${normalizedName}`);
    socketRef.current?.emit("exam:join", examCodeRef.current, normalizedName);
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
      finishReason={finishReason}
      updateExam={updateExam}
      searchForExam={searchForExam}
      joinExam={joinExam}
      submitExam={submitExam}
    />
  );
}
