"use client"

import { Download } from "lucide-react";
import type { Student } from "@/lib/exam-layout";
import { AlertButton } from "@/components/common/alert-button";

type Props = {
  students: Student[];
};

export function SubmissionsView({ students }: Props) {
  const submittedCount = students.filter((student) => student.completed).length;

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
          <AlertButton
            type="button"
            alertTitle="Coming soon"
            alertDescription="Downloading submissions is not implemented yet, but it is coming soon."
            confirmText="Got it"
            cancelText="Close"
          >
            <Download className="size-4" />
            Download
          </AlertButton>
        </div>
      </div>
    </section>
  );
}
