"use client"

import { ExamDocument } from "@/components/exam-document";
import type { Exam } from "@/lib/exam-layout";

type Props = {
  exam: Exam;
  updateExam: (exam: Exam) => void;
};

export function EditView({ exam, updateExam }: Props) {
  return (
    <section className="flex justify-center px-4 py-8">
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
