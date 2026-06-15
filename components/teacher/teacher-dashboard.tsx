"use client"

import { StudentChip, type StudentDisplayState } from "@/components/teacher/student-chip";
import type { Exam, Student } from "@/lib/exam-layout";

type Props = {
  examStatus: Exam["status"];
  roster: string[];
  students: Student[];
  onKickStudent: (name: string) => void;
};

export function TeacherDashboard({ examStatus, roster, students, onKickStudent }: Props) {
  const displayStudents = getDisplayStudents(roster, students, examStatus);

  return (
    <aside className="h-fit rounded-xl border bg-background p-5 shadow-xs">
      <div className="space-y-1.5 mb-2">
        <h2 className="text-xl">Student Dashboard</h2>
      </div>

      <div className="min-h-24 rounded-md border bg-muted/20 p-3">
        {displayStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Switch to the Roster View to add students.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {displayStudents.map((student) => (
              <StudentChip
                key={student.name}
                name={student.name}
                state={student.state}
                kickOnly
                onDelete={() => onKickStudent(student.name)}
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
