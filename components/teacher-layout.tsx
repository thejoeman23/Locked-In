"use client"

import { useEffect, useState } from "react";
import { CircleCheck, Copy } from "lucide-react";
import { ExamDocument } from "@/components/exam-document";
import { ExamLifecycleButton } from "@/components/exam-lifecycle-button";
import { ExamTitle } from "@/components/exam-title";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { Exam, Student } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  exam: Exam;
  examCode: string | null;
  roster: string[];
  students: Student[];
  updateExam: (exam: Exam) => void;
  onAddRosterName: (name: string) => void;
};

export function TeacherLayout({ exam, examCode, roster, students, updateExam, onAddRosterName }: Props) {
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
        <div className="relative flex min-h-18 items-center px-6">
          <BackButton />
          <div className="min-w-0 flex-1 ml-2.5">
            <ExamTitle
              title={exam.title}
              teacherView
              className="h-9 w-full max-w-md text-base"
              onTitleChange={updateExamTitle}
            />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base tracking-wide text-muted-foreground">
            Exam Editor
          </div>

          <div className="ml-6 flex min-w-0 items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyExamCode}
              disabled={!examCode}
              aria-label={examCode ? `Copy exam code ${examCode}` : "Exam code unavailable"}
              title={examCode ? "Copy exam code" : "Exam code unavailable"}
              className={cn(
                "h-9 overflow-hidden rounded-md border border-sky-200 bg-sky-50 px-3.5 text-base font-black text-sky-700 transition-[max-width,opacity,transform,padding,border-width] duration-300 ease-out hover:bg-sky-100 hover:text-sky-800 disabled:opacity-0",
                shouldShowExamCode
                  ? "max-w-56 translate-x-0 opacity-100"
                  : "max-w-0 translate-x-2 border-0 px-0 opacity-0 pointer-events-none"
              )}
            >
              <span className="tracking-[0.18em]">{examCode}</span>
              <span className="relative size-4">
                <Copy className={cn("absolute inset-0 size-4", copiedExamCode ? "scale-90 opacity-0" : "scale-100 opacity-100")} />
                <CircleCheck className={cn("absolute inset-0 size-4", copiedExamCode ? "scale-100 opacity-100" : "scale-90 opacity-0")} />
              </span>
            </Button>
            <ExamLifecycleButton exam={exam} updateExam={updateExam} />
          </div>
        </div>
      </header>

      <section className="grid justify-center gap-6 px-4 py-8 xl:grid-cols-[minmax(0,816px)_320px]">
        <div className="w-full max-w-[816px]">
          <ExamDocument
            exam={exam}
            teacherView
            onExamChange={updateExam}
          />
        </div>
        <TeacherDashboard
          examStatus={exam.status}
          roster={roster}
          students={students}
          onAddRosterName={onAddRosterName}
        />
      </section>
    </main>
  );
}
