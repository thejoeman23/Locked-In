"use client"

import { useState } from "react";
import { ExamDocument } from "@/components/exam-document";
import { ExamTitle } from "@/components/exam-title";
import { Exam, StudentStatus } from "@/lib/exam-layout";
import { Field, FieldTitle, FieldDescription } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = { 
  exam: Exam | null;
  status: StudentStatus;
  errorMessage: string | null;
  updateExam: (exam: Exam) => void; 
  syncExam: () => void; 
  searchForExam: (code: string) => void; 
  joinExam: (name: string) => void; 
  submitExam: () => void 
};

export function StudentLayout({ exam, status, errorMessage, updateExam, searchForExam, joinExam, submitExam }: Props) {
  const [examCode, setExamCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const errorDisplay = 
    <p className="text-xs font-medium text-red-600 text-center">{errorMessage ? errorMessage : "    "}</p>

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      {status === "join-code" && (
        <Field className="w-full max-w-sm">
          <FieldTitle>Exam Code</FieldTitle>
          <FieldDescription>Enter your exam code.</FieldDescription>
          <Input
            value={examCode}
            onChange={(event) => setExamCode(event.target.value)}
            placeholder="0000-0000"
          />
          <Button onClick={() => searchForExam(examCode)}>Join</Button>
          {errorDisplay}
        </Field>
      )}

      {status === "enter-name" && (
        <Field className="w-full max-w-sm">
          <FieldTitle>Name</FieldTitle>
          <FieldDescription>Enter your name exactly as your teacher has it.</FieldDescription>
          <Input
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder="Your name"
          />
          <Button onClick={() => joinExam(studentName)}>Continue</Button>
          {errorDisplay}
        </Field>
      )}

      {status === "waiting" && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">You are in.</h1>
          <p className="text-sm text-muted-foreground">Waiting for your teacher to start the exam.</p>
          {errorDisplay}
        </div>
      )}

      {status === "taking-exam" && exam && (
        <div className="min-h-screen w-full bg-[#f1f3f4] text-foreground">
          <header className="sticky top-0 z-10 border-b bg-background shadow-xs">
            <div className="flex min-h-14 items-center gap-3 px-16">
              <ExamTitle title={exam.title} teacherView={false} className="min-w-0 flex-1" />
            </div>
          </header>

          <section className="flex justify-center px-4 py-8">
            <div className="w-full max-w-[816px]">
              <ExamDocument exam={exam} teacherView={false} onExamChange={updateExam} />
              <Button onClick={submitExam}>Submit</Button>
            </div>
          </section>
        </div>
      )}

      {status === "finished" && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Finished</h1>
          <p className="text-sm text-muted-foreground">Your exam has been submitted.</p>
        </div>
      )}
    </main>
  );
}
