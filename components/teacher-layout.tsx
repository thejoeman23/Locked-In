"use client"

import { useEffect, useState } from "react";
import { CircleCheck, Copy } from "lucide-react";
import { ExamDocument } from "@/components/exam-document";
import { ExamLifecycleButton } from "@/components/exam-lifecycle-button";
import { ExamTitle } from "@/components/exam-title";
import { Button } from "@/components/ui/button";
import { Exam } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = { exam: Exam; examCode: string | null; updateExam: (exam: Exam) => void };
export function TeacherLayout({ exam, examCode, updateExam }: Props) {
  const [copiedExamCode, setCopiedExamCode] = useState(false);
  const shouldShowExamCode = examCode && (exam.status === "waiting" || exam.status === "live");

  function updateExamTitle(title: string) {
    updateExam({ ...exam, title });
  }

  useEffect(() => {
    if (!copiedExamCode) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedExamCode(false), 1100);

    return () => window.clearTimeout(timeout);
  }, [copiedExamCode]);

  async function copyExamCode() {
    if (!examCode) {
      return;
    }

    await navigator.clipboard.writeText(examCode);
    setCopiedExamCode(true);
  }

  return (
    <main className="min-h-screen w-full bg-[#f1f3f4] text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background shadow-xs">
        <div className="flex min-h-17 items-center gap-3 pl-16 pr-6">
          <div className="min-w-0 flex-1">
            <ExamTitle
              title={exam.title}
              teacherView
              className="w-full max-w-md"
              onTitleChange={updateExamTitle}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copyExamCode}
            disabled={!examCode}
            aria-label={examCode ? `Copy exam code ${examCode}` : "Exam code unavailable"}
            title={examCode ? "Copy exam code" : "Exam code unavailable"}
            className={cn(
              "h-8 overflow-hidden rounded-md border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-700 transition-[max-width,opacity,transform,padding,border-width] duration-300 ease-out hover:bg-sky-100 hover:text-sky-800 disabled:opacity-0",
              shouldShowExamCode
                ? "max-w-44 translate-x-0 opacity-100"
                : "max-w-0 translate-x-2 border-0 px-0 opacity-0 pointer-events-none"
            )}
          >
            <span>{examCode}</span>
            <span className="relative size-4">
              <Copy className={cn("absolute inset-0 size-4", copiedExamCode ? "scale-90 opacity-0" : "scale-100 opacity-100")} />
              <CircleCheck className={cn("absolute inset-0 size-4", copiedExamCode ? "scale-100 opacity-100" : "scale-90 opacity-0")} />
            </span>
          </Button>
          <ExamLifecycleButton exam={exam} updateExam={updateExam} />
        </div>
      </header>

      <section className="flex justify-center px-4 py-8">
        <div className="w-full max-w-[816px]">
          <ExamDocument
            exam={exam}
            teacherView
            onExamChange={updateExam}
          />
        </div>
      </section>
    </main>
  );
}
