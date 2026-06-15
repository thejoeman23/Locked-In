"use client"

import { Download } from "lucide-react";
import type { Exam, Student } from "@/lib/exam-layout";
import { Button } from "@/components/ui/button";

type Props = {
  examStatus: Exam["status"];
  students: Student[];
};

export function SubmissionsView({ examStatus, students }: Props) {
  const submittedCount = students.filter((student) => student.completed).length;
  const canDownload = examStatus === "setup" && submittedCount > 0;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="rounded-xl border bg-background p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl">Submissions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {submittedCount} of {students.length} students submitted.
            </p>
          </div>
          <Button type="button" disabled={!canDownload}>
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </div>
    </section>
  );
}
