"use client"

import { Circle, CircleCheck, Clock3, CirclePlus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/delete-button";
import type { Exam, Student } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type StudentDisplayState = "not-connected" | "connected" | "in-progress" | "submitted";

type Props = {
  examStatus: Exam["status"];
  roster: string[];
  students: Student[];
  onAddRosterName: (name: string) => void;
  onRemoveRosterName: (name: string) => void;
};

export function TeacherDashboard({ examStatus, roster, students, onAddRosterName, onRemoveRosterName }: Props) {
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

  function handleAddStudentButton() {
    const inputElement = document.getElementById("student-name-input") as HTMLInputElement | null;
    if (!inputElement) return;

    if (inputElement.value === "") {
      inputElement.focus();
    } else {
      submitStudentName(); 
    }
  }

  return (
    <aside className="h-fit rounded-xl border bg-background p-5 shadow-xs">
      <div className="space-y-1.5">
        <h2 className="text-xl">Student Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Type a student&apos;s name and press Enter to allow them into this exam.
        </p>
      </div>

      <div className="mt-4 flex flex-row items-center gap-2">
        <Input
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              document.getElementById("submit-student-name-button")?.click();
            }
          }}
          placeholder="Student name"
          id="student-name-input"
        />
        <Button
          id="submit-student-name-button"
          onClick={handleAddStudentButton}
          size="icon"
          aria-label="Add student"
        >
          <CirclePlus />
        </Button>
      </div>

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
                onDelete={() => onRemoveRosterName(student.name)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function getDisplayStudents(roster: string[], students: Student[], examStatus: Exam["status"]) {
  const names = Array.from(new Set(roster));

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

function StudentChip({ name, state, onDelete }: { name: string; state: StudentDisplayState; onDelete: () => void }) {
  const Icon = {
    "not-connected": Circle,
    connected: CircleCheck,
    "in-progress": Clock3,
    submitted: CircleCheck
  }[state];

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded text-sm ring-1",
        state === "not-connected" && "bg-neutral-200 text-neutral-800 ring-neutral-300",
        state === "connected" && "bg-sky-50 text-sky-800 ring-sky-200",
        state === "in-progress" && "bg-amber-50 text-amber-900 ring-amber-200",
        state === "submitted" && "bg-emerald-50 text-emerald-900 ring-emerald-200"
      )}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-2 py-1"
      >
        <Icon className="size-3.5" />
        <span>{name}</span>
      </button>
      <DeleteButton
        triggersAlert={state === "connected" || state === "in-progress" ? true : false}
        alertDescription={state === "connected" || state === "in-progress" ? "This action will kick this student from the exam." : undefined}
        label={`Remove ${name} from roster`}
        onClick={onDelete}
        className={cn(
          "size-auto rounded-none border-y-0 border-r-0 px-1.5",
          state === "not-connected" && "border-neutral-300 bg-neutral-300/60 text-neutral-800 hover:bg-neutral-300",
          state === "connected" && "border-sky-200 bg-sky-100 text-sky-800 hover:bg-sky-200",
          state === "in-progress" && "border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-200",
          state === "submitted" && "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
        )}
      />
    </div>
  );
}
