"use client"

import { ExamDocument } from "@/components/exam-document";
import { ExamLifecycleButton } from "@/components/exam-lifecycle-button";
import { ExamTitle } from "@/components/exam-title";
import { Exam } from "@/lib/exam-layout";

type Props = { exam: Exam; updateExam: (exam: Exam) => void };
export function TeacherLayout({ exam, updateExam }: Props) {
  function updateExamTitle(title: string) {
    updateExam({ ...exam, title });
  }

  return (
    <main className="min-h-screen w-full bg-[#f1f3f4] text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background shadow-xs">
        <div className="flex min-h-14 items-center gap-3 px-16">
          <div className="min-w-0 flex-1">
            <ExamTitle
              title={exam.title}
              teacherView
              className="w-full max-w-md"
              onTitleChange={updateExamTitle}
            />
          </div>

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
