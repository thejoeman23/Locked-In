"use client"

import { Section } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  section: Section;
  teacherView: boolean;
  className?: string;
  children?: React.ReactNode;
  titleAction?: React.ReactNode;
  onTitleChange?: (title: string) => void;
};

export function ExamSection({ section, teacherView, className, children, titleAction, onTitleChange }: Props) {
  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex items-center gap-3 border-b">
        {teacherView ? (
          <input
            value={section.title ?? ""}
            onChange={(event) => onTitleChange?.(event.target.value)}
            placeholder="Section title"
            className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-xl leading-7 outline-none focus:border-ring"
          />
        ) : (
          <h2 className="min-w-0 flex-1 py-2 text-xl leading-7">{section.title}</h2>
        )}
        {titleAction}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}
