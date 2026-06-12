"use client"

import { ArrowUp, FileText, ListTree } from "lucide-react";
import type { Exam, ExamQuestion } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  exam: Exam;
  className?: string;
};

export function ExamOutline({ exam, className }: Props) {
  function scrollToElement(elementId: string) {
    document.getElementById(elementId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <aside className={cn("sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-slate-300 bg-slate-50/95 p-4 shadow-xs", className)}>
      <div className="mb-4 flex items-center gap-2 border-b border-slate-300 pb-3 text-sm font-semibold text-slate-900">
        <ListTree className="size-4 text-slate-600" />
        Exam Outline
      </div>

      {exam.content.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">No sections yet.</p>
      ) : (
        <nav aria-label="Exam outline" className="space-y-3">
          <button
            type="button"
            onClick={() => scrollToElement(getExamTopElementId())}
            className="flex w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 shadow-xs hover:border-slate-400 hover:bg-slate-100"
          >
            <ArrowUp className="size-3.5 shrink-0 text-slate-600" />
            Title
          </button>

          <div className="ml-5 space-y-5 border-l border-slate-300 pl-3">
            {exam.content.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                <button
                  type="button"
                  onClick={() => scrollToElement(getSectionElementId(sectionIndex))}
                  className="flex w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm shadow-xs hover:border-slate-400 hover:bg-slate-100"
                >
                  <FileText className="size-3.5 shrink-0 text-slate-600" />
                  <span className="block min-w-0 truncate font-semibold text-slate-900">
                    {section.title || `Section ${sectionIndex + 1}`}
                  </span>
                </button>

                {section.items.length > 0 && (
                  <div className="ml-5 space-y-1.5 border-l border-slate-300 pl-3">
                    {section.items.map((question, questionIndex) => (
                      <button
                        key={questionIndex}
                        type="button"
                        onClick={() => scrollToElement(getQuestionElementId(sectionIndex, questionIndex))}
                        className="flex w-full items-center justify-between gap-3 rounded-md border border-slate-200 bg-white/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
                      >
                        <span>Q{questionIndex + 1}</span>
                        <span className="truncate">{getQuestionTypeLabel(question)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </aside>
  );
}

export function getSectionElementId(sectionIndex: number) {
  return `exam-section-${sectionIndex}`;
}

export function getExamTopElementId() {
  return "exam-document-top";
}

export function getQuestionElementId(sectionIndex: number, questionIndex: number) {
  return `exam-section-${sectionIndex}-question-${questionIndex}`;
}

function getQuestionTypeLabel(question: ExamQuestion) {
  if ("options" in question) {
    return "MC";
  }

  if ("defenitions" in question) {
    return "Definitions";
  }

  if ("correctOptions" in question) {
    return "Highlight";
  }

  return "SA";
}
