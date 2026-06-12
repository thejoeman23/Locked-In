"use client"

import { CopyExamCodeButton } from "@/components/copy-exam-code-button";
import { ExamLifecycleButton } from "@/components/exam-lifecycle-button";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import type { Exam, Student } from "@/lib/exam-layout";

type Props = {
  exam: Exam;
  examCode: string | null;
  roster: string[];
  students: Student[];
  updateExam: (exam: Exam) => void;
  onAddRosterName: (name: string) => void;
  onAddRosterNames: (names: string[]) => void;
  onRemoveRosterName: (name: string) => void;
};

export function AdministerView({
  exam,
  examCode,
  roster,
  students,
  updateExam,
  onAddRosterName,
  onAddRosterNames,
  onRemoveRosterName
}: Props) {
  return (
    <section className="mx-auto column w-full max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-xl border bg-background p-6 shadow-xs mb-6">
        <CopyExamCodeButton examCode={examCode} />
        <div className="mt-5">
          <ExamLifecycleButton exam={exam} updateExam={updateExam}/>
        </div>
      </div>

      <TeacherDashboard
        examStatus={exam.status}
        roster={roster}
        students={students}
        onAddRosterName={onAddRosterName}
        onAddRosterNames={onAddRosterNames}
        onRemoveRosterName={onRemoveRosterName}
      />
    </section>
  );
}
