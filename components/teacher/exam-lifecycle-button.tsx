"use client"

import { Eye, Play, Square, Undo2 } from "lucide-react";
import { AlertButton } from "@/components/common/alert-button";
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
      newExam.status = "setup"
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
  const LifecycleIcon = {
    setup: Eye,
    waiting: Play,
    live: Square
  }[exam.status];

  return (
    <div
      className={cn(
        "flex min-h-14 w-full overflow-hidden rounded-lg border p-1 shadow-xs transition-colors",
        exam.status === "setup" && "border-sky-200 bg-sky-50 text-sky-700",
        exam.status === "waiting" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        exam.status === "live" && "border-amber-200 bg-amber-50 text-amber-800",
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
          className="h-auto w-12 self-stretch rounded-md border-0 bg-transparent px-0 text-current shadow-none hover:bg-black/5 hover:text-current"
        >
          <Undo2 className="size-4" />
        </AlertButton>
      )}
      <AlertButton
        triggersAlert={exam.status === "live" || exam.status === "waiting"}
        alertDescription={exam.status === "live" ? 
          "This action will end the exam for all students. Their finished exams will be saved for you to download.":
          "This action will start the exam for all students. Make sure everyone is ready before you start."}
        confirmVariant={exam.status === "live" ? "destructive" : undefined}
        type="button"
        variant="ghost"
        size="lg"
        onClick={handleButton}
        className="h-auto min-h-12 flex-1 rounded-md border-0 bg-background/80 px-4 text-base font-semibold text-current shadow-xs hover:bg-background hover:text-current disabled:bg-transparent disabled:shadow-none"
        {...props}
      >
        <LifecycleIcon className="size-4" />
        {exam.status === "setup" && "Reveal Exam Join Code"}
        {exam.status === "waiting" && "Start Exam"}
        {exam.status === "live" && "End Exam"}
      </AlertButton>
    </div>
  );
}
