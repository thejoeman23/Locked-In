"use client"

import { Circle, CircleCheck, Clock3 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Exam, Student } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type StudentDisplayState = "not-connected" | "connected" | "in-progress" | "submitted";

type Props = {
  examStatus: Exam["status"];
  roster: string[];
  students: Student[];
  onAddRosterName: (name: string) => void;
};

export function TeacherDashboard({ examStatus, roster, students, onAddRosterName }: Props) {
  const [studentName, setStudentName] = useState("");
  const displayStudents = getDisplayStudents(roster, students, examStatus);

  function submitStudentName() {
    const name = studentName.trim();

    if (!name) {
      return;
    }

    onAddRosterName(name);
    setStudentName("");
  }

  return (
    <aside className="h-fit rounded-xl border bg-background p-5 shadow-xs">
      <div className="space-y-1.5">
        <h2 className="text-xl">Student Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Type a student&apos;s name and press Enter to allow them into this exam.
        </p>
      </div>

      <Input
        value={studentName}
        onChange={(event) => setStudentName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submitStudentName();
          }
        }}
        placeholder="Student name"
        className="mt-4"
      />

      <div className="mt-5 min-h-24 rounded-md border bg-muted/20 p-3">
        {displayStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {displayStudents.map((student) => (
              <StudentChip
                key={student.name}
                name={student.name}
                state={student.state}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function getDisplayStudents(roster: string[], students: Student[], examStatus: Exam["status"]) {
  const names = Array.from(new Set([...roster, ...students.map((student) => student.name)]));

  return names.map((name) => {
    const student = students.find((item) => item.name === name);
    const state: StudentDisplayState = student
      ? getStudentState(student, examStatus)
      : "not-connected";

    return { name, state };
  });
}

function getStudentState(student: Student, examStatus: Exam["status"]): StudentDisplayState {
  if (student.completed) {
    return "submitted";
  }

  if (student.connected && examStatus === "live") {
    return "in-progress";
  }

  if (student.connected) {
    return "connected";
  }

  return "not-connected";
}

function StudentChip({ name, state }: { name: string; state: StudentDisplayState }) {
  const Icon = {
    "not-connected": Circle,
    connected: CircleCheck,
    "in-progress": Clock3,
    submitted: CircleCheck
  }[state];

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded px-2 py-1 text-sm",
        state === "not-connected" && "bg-neutral-200 text-neutral-800 ring-1 ring-neutral-300",
        state === "connected" && "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
        state === "in-progress" && "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
        state === "submitted" && "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
      )}
    >
      <span>{name}</span>
      <Icon className="size-3.5" />
    </button>
  );
}
