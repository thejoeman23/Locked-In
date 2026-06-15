"use client"

import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RosterPasteBox } from "@/components/teacher/roster-paste-box";
import { StudentChip, type StudentDisplayState } from "@/components/teacher/student-chip";
import type { Exam, Student } from "@/lib/exam-layout";
import { Button } from "@/components/ui/button";

type Props = {
  examStatus: Exam["status"];
  roster: string[];
  students: Student[];
  onAddRosterName: (name: string) => void;
  onAddRosterNames: (names: string[]) => void;
  onRemoveRosterName: (name: string) => void;
};

export function RosterCreator({ examStatus, roster, students, onAddRosterName, onAddRosterNames, onRemoveRosterName }: Props) {
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
        <h2 className="text-xl">Exam Roster</h2>
        <p className="text-sm text-muted-foreground">
          Type a student&apos;s name and press Enter to allow them into this exam.{" "}
          <span className="text-foreground">
            Names are saved in all caps so the same student is recognized even if capitalization is typed differently.
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-row items-center gap-2">
        <Input
          value={studentName}
          onChange={(event) => setStudentName(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              document.getElementById("submit-student-name-button")?.click();
            }
          }}
          placeholder="Student name"
          id="student-name-input"
          className="uppercase"
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

      <p className="my-2 text-center text-xs text-muted-foreground">OR</p>
      <RosterPasteBox onPasteRoster={onAddRosterNames} />

      <Separator className="my-5" />

      <div className="min-h-24 rounded-md border bg-muted/20 p-3">
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
