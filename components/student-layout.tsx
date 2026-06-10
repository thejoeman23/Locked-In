"use client"

import { useEffect, useRef, useState } from "react";
import { ExamDocument } from "@/components/exam-document";
import { Exam, StudentFinishReason, StudentStatus } from "@/lib/exam-layout";
import { Field, FieldTitle, FieldDescription } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertButton } from "./alert-button";
import { BackButton } from "./back-button"; 
import { ErrorMessage } from "./error-message";

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
  const joinCodeInputRef = useRef<HTMLInputElement | null>(null);
  const [examCode, setExamCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const errorDisplay = <ErrorMessage message={errorMessage} />;
  const joinCodeCharacters = Array.from({ length: 6 }, (_, index) => examCode[index] ?? "");

  useEffect(() => {
    if (status === "join-code") {
      joinCodeInputRef.current?.focus();
    }
  }, [status]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <BackButton className="absolute top-4 left-4" />
      {status === "join-code" && (
        <Field className="w-full max-w-[22rem]">
          <FieldTitle>Exam Code</FieldTitle>
          <FieldDescription>Enter your exam code.</FieldDescription>
          <label className="relative flex w-full cursor-text justify-center gap-4 py-3">
            <input
              ref={joinCodeInputRef}
              value={examCode}
              onChange={(event) => setExamCode(event.target.value.toUpperCase().slice(0, 6))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  searchForExam(examCode);
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
                const pastedText = event.clipboardData.getData("text/plain").trim();
                if (pastedText && pastedText.length === 6) {
                  setExamCode(pastedText.toUpperCase());
                }
              }}
              onBlur={() => window.setTimeout(() => joinCodeInputRef.current?.focus(), 0)}
              maxLength={6}
              autoFocus
              aria-label="Exam code"
              className="absolute inset-0 h-full w-full cursor-text opacity-0"
            />
            {joinCodeCharacters.map((character, index) => (
              <span
                key={index}
                className="relative flex h-16 w-12 items-center justify-center border-b-2 border-foreground text-center text-5xl"
              >
                {character}
                {index === Math.min(examCode.length, 5) && (
                  <span
                    className={`absolute top-1/2 h-9 w-px -translate-y-1/2 animate-pulse bg-foreground ${
                      examCode.length >= 6 ? "right-1" : "left-1/2 -translate-x-1/2"
                    }`}
                  />
                )}
              </span>
            ))}
          </label>
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
            onChange={(event) => setStudentName(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                joinExam(studentName);
              }
            }}
            placeholder="Your name"
            className="uppercase"
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
