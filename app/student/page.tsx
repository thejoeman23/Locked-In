"use client";

import { Field, FieldTitle, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Exam } from "@/lib/exam-layout";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const examCodeRef = useRef<string | null>(null);
  const statusRef = useRef<"join-code" | "enter-name" | "waiting" | "taking-exam" | "finished">("join-code");
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Exam socket connection failed:", error.message);
    });

    socket.on("exam:found", () => {
      statusRef.current = "enter-name";
      console.log("Exam found with code:", examCodeRef.current);
    });

    socket.on("exam:notfound", () => {
      statusRef.current = "join-code";
      console.warn("Exam not found with code:", examCodeRef.current);
    });

    socket.on("exam:invalidname", () => {
      console.warn("Invalid name for exam with code:", examCodeRef.current);
    });

    socket.on("exam:nameinuse", () => {
      console.warn("Name already in use for exam with code:", examCodeRef.current);
    });

    socket.on("exam:joined", () => {
      statusRef.current = "waiting";
      console.log("Joined exam with unique code:", examCodeRef.current);
    });

    socket.on("exam:started", (uniqueExam: Exam) => {
      statusRef.current = "taking-exam";
      setExam(uniqueExam);
      console.log("Exam started:", uniqueExam.title);
    });

    socket.on("exam:synced", () => {
      console.log("Exam synced");
    });

    return () => {
      // Avoid keeping stale socket event handlers alive after leaving /teacher.
      socket.disconnect();
      socketRef.current = null;
      examCodeRef.current = null;
    };
  }, []);

  function searchForExam(code: string) {
    examCodeRef.current = code;
    console.log("Searching for exam with code:", examCodeRef.current);
    socketRef.current?.emit("exam:search", examCodeRef.current);
  }

  function joinExam(name: string) {
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

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Field className="w-500 max-w-sm">
        <FieldTitle>Exam Code</FieldTitle>
        <FieldDescription>Enter your exam code.</FieldDescription>
        <Input placeholder="0000-0000" />
      </Field>
    </main>
  );
}
