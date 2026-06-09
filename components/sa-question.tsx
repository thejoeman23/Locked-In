"use client"

import { Trash2 } from "lucide-react";
import { SAQuestion as SAQuestionType } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  question: SAQuestionType;
  teacherView: boolean;
  className?: string;
  onQuestionChange?: (question: SAQuestionType) => void;
  onDelete?: () => void;
};

export function SAQuestion({ question, teacherView, className, onQuestionChange, onDelete }: Props) {
  function updateQuestion(patch: Partial<SAQuestionType>) {
    onQuestionChange?.({ ...question, ...patch });
  }

  return (
    <div className={cn("rounded-lg border bg-background/80 p-4 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50/60", className)}>
      <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Short answer</span>
        {teacherView ? (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 normal-case tracking-normal">
              <span>Points</span>
              <input
                type="number"
                min={0}
                value={question.worth ?? 0}
                onChange={(event) => updateQuestion({ worth: Number(event.target.value) })}
                className="h-7 w-16 rounded-md border bg-transparent px-2 text-right text-foreground outline-none focus:border-ring"
              />
            </label>
            {onDelete && (
              <button
                type="button"
                aria-label="Delete question"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
                className="inline-flex size-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <span>{question.worth} pts</span>
        )}
      </div>

      {teacherView ? (
        <textarea
          value={question.text ?? ""}
          onChange={(event) => updateQuestion({ text: event.target.value })}
          placeholder="Short answer question"
          className="mt-3 min-h-20 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring"
        />
      ) : (
        <p className="mt-3 text-sm font-medium leading-6">{question.text}</p>
      )}

      <textarea
        value={teacherView ? "" : question.answer ?? ""}
        disabled={teacherView}
        onChange={(event) => updateQuestion({ answer: event.target.value })}
        placeholder={teacherView ? "Student answer area" : "Type your answer"}
        className="mt-4 min-h-24 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring disabled:bg-muted/30"
      />
    </div>
  );
}
