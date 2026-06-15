"use client";

import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { ActiveExam, Exam, Roster, Student, TeacherMode } from "@/lib/exam-layout";
import { NewExam, NewRoster } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { localTeacherStorage } from "@/lib/local-teacher-storage";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function Home() {
  const { id: examId } = useParams<{ id: string }>();

  const initialExam = useMemo(() => ({ ...NewExam(), id: examId }), [examId]);
  const initialRoster = useMemo(() => NewRoster(), []);
  // Refs keep connection/session objects available without causing re-renders.
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const rejoinAttemptRef = useRef<string | null>(null);
  const rosterRef = useRef<Roster>(initialRoster);
  const [examCode, setExamCode] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [roster, setRoster] = useState<Roster>(initialRoster);
  const [students, setStudents] = useState<Student[]>([]);
  const [exam, setExam] = useState<Exam>(initialExam);

  useEffect(() => {
    let isMounted = true;

    async function loadExam() {
      const savedExam = await localTeacherStorage.getExam(examId);
      const nextExam = {
        ...(savedExam ?? initialExam),
        status: getSupportedExamStatus((savedExam ?? initialExam).status),
        teacher_mode: (savedExam ?? initialExam).teacher_mode ?? "edit"
      };

      if (!savedExam) {
        await localTeacherStorage.saveExam(nextExam);
      }

      if (isMounted) {
        setExam(nextExam);
      }
    }

    loadExam();

    return () => {
      isMounted = false;
    };
  }, [examId, initialExam]);

  useEffect(() => {
    // The teacher owns a single socket connection for this page session.
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Exam socket connection failed:", error.message);
    });

    socket.on("exam:created", (createdExamCode) => {
      console.log("Exam created with code:", createdExamCode);
      rejoinAttemptRef.current = null;
      examCodeRef.current = createdExamCode;
      setExamCode(createdExamCode);
      socket.emit("exam:updateroster", createdExamCode, rosterRef.current);
    });

    socket.on("exam:update", (activeExam: ActiveExam) => {
      rejoinAttemptRef.current = null;
      rosterRef.current = activeExam.roster;
      setRoster(activeExam.roster);
      setStudents(activeExam.students);
    });

    socket.on("exam:teacherrejoined", (activeExamCode: string, activeExam: ActiveExam) => {
      console.log("Teacher rejoined exam with code:", activeExamCode);
      rejoinAttemptRef.current = null;
      examCodeRef.current = activeExamCode;
      setExamCode(activeExamCode);
      setExam((currentExam) => ({
        ...activeExam.exam,
        teacher_mode: currentExam.teacher_mode ?? activeExam.exam.teacher_mode ?? "edit"
      }));
      rosterRef.current = activeExam.roster;
      setRoster(activeExam.roster);
      setStudents(activeExam.students);
    });

    socket.on("exam:examnotfound", () => {
      console.warn("Active exam not found while attempting teacher rejoin. Returning exam to setup.");
      rejoinAttemptRef.current = null;
      examCodeRef.current = null;
      setExamCode(null);
      setStudents([]);
      setExam((currentExam) => {
        const setupExam: Exam = {
          ...currentExam,
          status: "setup",
          last_updated: new Date().toISOString()
        };

        localTeacherStorage.saveExam(setupExam);
        return setupExam;
      });
    });

    return () => {
      // Avoid keeping stale socket event handlers alive after leaving /teacher.
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
      examCodeRef.current = null;
      rejoinAttemptRef.current = null;
      const emptyRoster = NewRoster();
      rosterRef.current = emptyRoster;
      setExamCode(null);
      setRoster(emptyRoster);
      setStudents([]);
    };
  }, []);

  useEffect(() => {
    if (examCode || !socketConnected || (exam.status !== "waiting" && exam.status !== "live")) {
      rejoinAttemptRef.current = null;
      return;
    }

    const rejoinKey = `${examId}:${exam.status}`;
    if (rejoinAttemptRef.current === rejoinKey) {
      return;
    }

    rejoinAttemptRef.current = rejoinKey;
    socketRef.current?.emit("exam:rejointeacher", examId);
  }, [exam.status, examId, examCode, socketConnected]);

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

    if (currentStatus === "live" && nextStatus === "setup") {
      console.log("Ending exam and returning to setup...");
      socketRef.current?.emit("exam:terminate", examCode, "manual");
      examCodeRef.current = null;
      setExamCode(null);
      setStudents([]);
    }

    if (
      examCode &&
      currentStatus === "waiting" &&
      nextStatus !== "setup"
    ) {
      socketRef.current?.emit("exam:update", examCode, newExam);
    }

    const savedExam = {
      ...newExam,
      last_updated: new Date().toISOString()
    };

    setExam(savedExam);
    localTeacherStorage.saveExam(savedExam);
  }

  function updateTeacherMode(mode: TeacherMode) {
    const savedExam = {
      ...exam,
      teacher_mode: mode,
      last_updated: new Date().toISOString()
    };

    setExam(savedExam);
    localTeacherStorage.saveExam(savedExam);
  }

  function addRosterName(name: string) {
    const trimmedName = normalizeStudentName(name);

    if (!trimmedName) {
      return;
    }

    const nextRoster = updateRosterNames(rosterRef.current, [
      ...rosterRef.current.names,
      trimmedName
    ]);
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

  function addRosterNames(names: string[]) {
    const nextNames = names.map(normalizeStudentName).filter(Boolean);

    if (nextNames.length === 0) {
      return;
    }

    const nextRoster = updateRosterNames(rosterRef.current, [
      ...rosterRef.current.names,
      ...nextNames
    ]);
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

  function removeRosterName(name: string) {
    const normalizedName = normalizeStudentName(name);
    const nextRoster = updateRosterNames(
      rosterRef.current,
      rosterRef.current.names.filter((studentName) => studentName !== normalizedName)
    );
    const currentExamCode = examCodeRef.current ?? examCode;
    const student = students.find((student) => student.name === normalizedName);

    rosterRef.current = nextRoster;
    setRoster(nextRoster);

    if (currentExamCode) {
      if (student?.connected) {
        console.log("Kicking student from exam:", currentExamCode, normalizedName);
        socketRef.current?.emit("exam:kickstudent", currentExamCode, normalizedName);
      }

      console.log("Updating roster on server:", currentExamCode, nextRoster);
      socketRef.current?.emit("exam:updateroster", currentExamCode, nextRoster);
    } else {
      console.log("Roster updated locally before exam code exists:", nextRoster);
    }
  }

  function kickStudent(name: string) {
    const normalizedName = normalizeStudentName(name);
    const currentExamCode = examCodeRef.current ?? examCode;

    if (!currentExamCode) {
      return;
    }

    console.log("Kicking student from exam:", currentExamCode, normalizedName);
    socketRef.current?.emit("exam:kickstudent", currentExamCode, normalizedName);
  }

  return (
    <TeacherLayout
      exam={exam}
      examCode={examCode}
      mode={exam.teacher_mode}
      roster={roster.names}
      students={students}
      updateExam={updateExam}
      onModeChange={updateTeacherMode}
      onAddRosterName={addRosterName}
      onAddRosterNames={addRosterNames}
      onRemoveRosterName={removeRosterName}
      onKickStudent={kickStudent}
    />
  );
}

function normalizeStudentName(name: string) {
  return name.trim().replace(/\s+/g, " ").toUpperCase();
}

function updateRosterNames(roster: Roster, names: string[]): Roster {
  return {
    ...roster,
    names: Array.from(new Set(names.map(normalizeStudentName).filter(Boolean)))
  };
}

function getSupportedExamStatus(status: string): Exam["status"] {
  if (status === "waiting" || status === "live") {
    return status;
  }

  return "setup";
}
