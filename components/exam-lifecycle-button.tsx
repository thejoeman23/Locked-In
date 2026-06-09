"use client"

import { MenuBarButton } from "@/components/menu-bar-button";
import { Exam } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof MenuBarButton> & {
  exam: Exam;
  updateExam: (exam: Exam) => void;
};

export function ExamLifecycleButton({ exam, updateExam, className, ...props }: Props) {
  function handleButton() {
    const newExam = { ...exam }

    // This is the primary control for moving the exam through its lifecycle.
    if (exam.status === "setup") {
      newExam.status = "waiting"
    } else if (exam.status === "waiting") {
      newExam.status = "live"
    } else if (exam.status === "live") {
      newExam.status = "terminated"
    }

    updateExam(newExam)
  }

  return (
    <MenuBarButton
      onClick={handleButton}
      className={cn(
        "min-w-28 border font-semibold shadow-xs",
        exam.status === "setup" && "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800",
        exam.status === "waiting" && "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
        exam.status === "live" && "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900",
        exam.status === "terminated" && "border-zinc-300 bg-zinc-100 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-500",
        className
      )}
      disabled={exam.status === "terminated"}
      {...props}
    >
      {exam.status === "setup" && "Reveal Code"}
      {exam.status === "waiting" && "Start Exam"}
      {exam.status === "live" && "End Exam"}
      {exam.status === "terminated" && "Exam Terminated"}
    </MenuBarButton>
  );
}
