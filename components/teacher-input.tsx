"use client"

import { Input } from "./ui/input";
import { Exam } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Input> & { exam: Exam; updateExam: (exam: Exam) => void };
export function TeacherInput({ exam, updateExam, className, ...props }: Props) {

  function onInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    // Keep parent state as the source of truth; this component only edits the title.
    const newExam = { ...exam }
    newExam.title = e.target.value
    updateExam(newExam)
  }

  return (
    <Input
      defaultValue={exam.title}
      onBlur={onInputChanged}
      placeholder="Untitled exam"
      className={cn("h-8 border-transparent bg-transparent px-2 text-base shadow-none hover:border-border focus-visible:border-ring", className)}
      {...props}
    />
  );
}
