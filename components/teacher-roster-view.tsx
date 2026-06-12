"use client"

import type { Exam, Student } from "@/lib/exam-layout";
import { RosterCreator } from "./roster-creator";

type Props = {
  examStatus: Exam["status"];
  roster: string[];
  students: Student[];
  onAddRosterName: (name: string) => void;
  onAddRosterNames: (names: string[]) => void;
  onRemoveRosterName: (name: string) => void;
};

export function RosterView({
  examStatus,
  roster,
  students,
  onAddRosterName,
  onAddRosterNames,
  onRemoveRosterName
}: Props) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <RosterCreator
        examStatus={examStatus}
        roster={roster}
        students={students}
        onAddRosterName={onAddRosterName}
        onAddRosterNames={onAddRosterNames}
        onRemoveRosterName={onRemoveRosterName}
      />
    </section>
  );
}
