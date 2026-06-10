"use client"

import { Undo2 } from "lucide-react";
import { AlertButton } from "@/components/alert-button";
import { Exam } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof AlertButton> & {
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

  function handleBack() {
    const newExam = { ...exam }

    if (exam.status === "live") {
      newExam.status = "waiting"
    } else if (exam.status === "waiting") {
      newExam.status = "setup"
    }

    updateExam(newExam)
  }

  const canGoBack = exam.status === "waiting" || exam.status === "live";

  return (
    <div
      className={cn(
        "inline-flex h-9 overflow-hidden rounded-md border",
        exam.status === "setup" && "border-sky-200 bg-sky-50 text-sky-700",
        exam.status === "waiting" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        exam.status === "live" && "border-amber-200 bg-amber-50 text-amber-800",
        exam.status === "terminated" && "border-zinc-300 bg-zinc-100 text-zinc-500",
        className
      )}
    >
      {canGoBack && (
        <AlertButton
          triggersAlert={exam.status === "live"}
          alertTitle="Are you absolutely sure?"
          alertDescription={exam.status === "live" ? "This action will end the exam for all students. Their progress will be erased." : undefined}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={exam.status === "live" ? "Return exam to waiting" : "Return exam to setup"}
          title={exam.status === "live" ? "Return exam to waiting" : "Return exam to setup"}
          onClick={handleBack}
          className="h-9 w-9 rounded-none border-0 bg-transparent px-0 text-current shadow-none hover:bg-black/5 hover:text-current"
        >
          <Undo2 className="size-4" />
        </AlertButton>
      )}
      {canGoBack && <div className="h-full w-px bg-current/20" />}
      <AlertButton
        triggersAlert={exam.status === "live" || exam.status === "waiting"}
        alertDescription={exam.status === "live" ? 
          "This action will end the exam for all students. Their finished exams will be saved for you to download.":
          "This action will start the exam for all students. Make sure everyone is ready before you start."}
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleButton}
        className="h-9 min-w-32 rounded-none border-0 bg-transparent px-4 text-sm text-current shadow-none hover:bg-black/5 hover:text-current"
        disabled={exam.status === "terminated"}
        {...props}
      >
        {exam.status === "setup" && "Reveal Exam Join Code"}
        {exam.status === "waiting" && "Start Exam"}
        {exam.status === "live" && "End Exam"}
        {exam.status === "terminated" && "Exam Terminated"}
      </AlertButton>
    </div>
  );
}
