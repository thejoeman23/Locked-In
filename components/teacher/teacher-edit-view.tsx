"use client"

import { ExamDocument } from "@/components/exam/exam-document";
import { ExamOutline } from "@/components/exam/exam-outline";
import type { Exam } from "@/lib/exam-layout";

type Props = {
  exam: Exam;
  updateExam: (exam: Exam) => void;
};

export function EditView({ exam, updateExam }: Props) {
  return (
    <section className="grid justify-center gap-6 px-4 py-8 xl:grid-cols-[220px_minmax(0,816px)]">
      <ExamOutline exam={exam} className="hidden xl:block" />
      <div className="w-full max-w-[816px]">
        <ExamDocument
          exam={exam}
          teacherView
          onExamChange={updateExam}
        />
      </div>
    </section>
  );
}
