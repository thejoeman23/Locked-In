"use client"

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  teacherView: boolean;
  className?: string;
  onTitleChange?: (title: string) => void;
};

export function ExamTitle({ title, teacherView, className, onTitleChange }: Props) {
  if (!teacherView) {
    return (
      <h1 className={cn("text-2xl font-semibold", className)}>
        {title || "Untitled exam"}
      </h1>
    );
  }

  return (
    <Input
      value={title ?? ""}
      onChange={(event) => onTitleChange?.(event.target.value)}
      placeholder="Untitled exam"
      className={cn(
        "h-8 border-transparent bg-transparent px-2 text-base font-medium shadow-none hover:border-border focus-visible:border-ring",
        className
      )}
    />
  );
}
