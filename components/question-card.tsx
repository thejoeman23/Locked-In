"use client"

import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  worth: number;
  teacherView: boolean;
  className?: string;
  children: React.ReactNode;
  studentAction?: React.ReactNode;
  pointInputClassName?: string;
  pointInputProps?: Omit<React.ComponentProps<"input">, "className" | "type" | "value" | "onChange">;
  onWorthChange?: (worth: number) => void;
  onDelete?: () => void;
};

export function QuestionCard({
  label,
  worth,
  teacherView,
  className,
  children,
  studentAction,
  pointInputClassName,
  pointInputProps,
  onWorthChange,
  onDelete
}: Props) {
  return (
    <div className={cn("rounded-lg border bg-background/80 p-4 shadow-xs transition-colors", teacherView ? "hover:border-slate-300 hover:bg-slate-50/60" : undefined, className)}>
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        {teacherView ? (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 normal-case tracking-normal">
              <span>Points</span>
              <input
                type="number"
                value={worth}
                onChange={(event) => onWorthChange?.(Number(event.target.value))}
                onFocus={(event) => event.target.select()}
                className={cn("h-7 w-16 rounded-md border bg-transparent px-2 text-right text-foreground outline-none focus:border-ring", pointInputClassName)}
                {...pointInputProps}
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
          <div className="flex items-center gap-2">
            <span>{worth} pts</span>
            {studentAction}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
