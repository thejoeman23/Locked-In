"use client";

import { Exam } from "@/lib/exam-layout";
import { TeacherInput } from "@/components/teacher-input";
import { TeacherButton } from "@/components/teacher-button";
import { useState } from "react";

export default function Home() {
  const [exam, setExam] = useState<Exam>({
    title: "",
    status: "setup",
    content: []
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