"use client"

import { useState } from "react";
import { ExamTitle } from "@/components/exam-title";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { AdministerView } from "@/components/teacher-administer-view";
import { EditView } from "@/components/teacher-edit-view";
import { RosterView } from "@/components/teacher-roster-view";
import { SubmissionsView } from "@/components/teacher-submissions-view";
import { Exam, Student } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

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

type TeacherMode = "edit" | "roster" | "administer" | "submissions";

const teacherModes: { value: TeacherMode; label: string }[] = [
  { value: "edit", label: "Edit" },
  { value: "roster", label: "Roster" },
  { value: "administer", label: "Administer" },
  { value: "submissions", label: "Submissions" }
];

export function TeacherLayout({ exam, examCode, roster, students, updateExam, onAddRosterName, onAddRosterNames, onRemoveRosterName }: Props) {
  const [mode, setMode] = useState<TeacherMode>("edit");

  function updateExamTitle(title: string) {
    updateExam({ ...exam, title });
  }

  return (
    <main className="min-h-screen w-full bg-[#f1f3f4] text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background shadow-xs">
        <div className="relative flex min-h-18 items-center gap-4 px-4">
          <BackButton />
          <div className="min-w-0 flex-1">
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

          <div className="ml-6 flex min-w-0 items-center justify-end gap-2">
            <div className="inline-flex rounded-md border bg-muted/40 p-1">
              {teacherModes.map((teacherMode) => (
                <Button
                  key={teacherMode.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode(teacherMode.value)}
                  className={cn(
                    "h-8 rounded-sm px-3 text-sm shadow-none",
                    mode === teacherMode.value && "bg-background text-foreground shadow-xs"
                  )}
                >
                  {teacherMode.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {mode === "edit" && (
        <EditView
          exam={exam}
          updateExam={updateExam}
        />
      )}

      {mode === "roster" && (
        <RosterView
          examStatus={exam.status}
          roster={roster}
          students={students}
          onAddRosterName={onAddRosterName}
          onAddRosterNames={onAddRosterNames}
          onRemoveRosterName={onRemoveRosterName}
        />
      )}

      {mode === "administer" && (
        <AdministerView
          exam={exam}
          examCode={examCode}
          roster={roster}
          students={students}
          updateExam={updateExam}
          onAddRosterName={onAddRosterName}
          onAddRosterNames={onAddRosterNames}
          onRemoveRosterName={onRemoveRosterName}
        />
      )}

      {mode === "submissions" && (
        <SubmissionsView
          examStatus={exam.status}
          students={students}
        />
      )}
    </main>
  );
}
