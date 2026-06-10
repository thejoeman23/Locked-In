"use client"

import { useState } from "react";
import { ExamDocument } from "@/components/exam-document";
import { Exam, StudentFinishReason, StudentStatus } from "@/lib/exam-layout";
import { Field, FieldTitle, FieldDescription } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertButton } from "./alert-button";

type Props = { 
  exam: Exam | null;
  status: StudentStatus;
  errorMessage: string | null;
  finishReason: StudentFinishReason;
  updateExam: (exam: Exam) => void; 
  searchForExam: (code: string) => void; 
  joinExam: (name: string) => void; 
  submitExam: () => void 
};

export function StudentLayout({ exam, status, errorMessage, finishReason, updateExam, searchForExam, joinExam, submitExam }: Props) {
  const [examCode, setExamCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const errorDisplay = 
    <p className="text-xs text-red-600 text-center">{errorMessage ? errorMessage : "    "}</p>

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
          <h1 className="text-2xl">You are in.</h1>
          <p className="text-sm text-muted-foreground">Waiting for your teacher to start the exam.</p>
          {errorDisplay}
        </div>
      )}

      {status === "taking-exam" && exam && (
        <div className="min-h-screen w-full bg-[#f1f3f4] text-foreground">
          <section className="flex justify-center px-4 py-8">
            <div className="w-full max-w-[816px]">
              <ExamDocument exam={exam} teacherView={false} onExamChange={updateExam} />
              <AlertButton 
              alertDescription="Before submitting your exam, please review all your answers and any starred questions." 
              onClick={submitExam}
              confirmText="Submit Exam"
              className="w-full h-14 mt-4"
              >
                Submit
              </AlertButton>
            </div>
          </section>
        </div>
      )}

      {status === "finished" && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl">Finished</h1>
          <p className="text-sm text-muted-foreground">{getFinishedMessage(finishReason)}</p>
        </div>
      )}
    </main>
  );
}

function getFinishedMessage(reason: StudentFinishReason) {
  if (reason === "timeout") {
    return "Time expired. Your exam has ended.";
  }

  if (reason === "manual") {
    return "Your teacher ended the exam.";
  }

  return "Your exam has been submitted.";
}
