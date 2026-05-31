"use client";

import Link from "next/link";
import { TeacherInput } from "@/components/teacher-input";
import { TeacherButton } from "@/components/teacher-button";
import { useState } from "react";

export default function Home() {
  const [exam, setExam] = useState<Exam>({
    id: "",
    title: "",
    status: "setup"
  });

  function updateExam(exam: Exam) {
    setExam(exam);
    console.log(JSON.stringify(exam));
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <TeacherInput exam={exam} updateExam={updateExam} />
      <TeacherButton exam={exam} updateExam={updateExam} className="w-full max-w-sm" variant="outline"/>
    </main>
  );
}

export interface Exam {
    id: string;
    title: string;
    status: "setup" | "waiting" | "running" | "ended";
}