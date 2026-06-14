"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  ariaLabel: string;
  preview: ReactNode;
  metadata?: string;
  previewClassName?: string;
  onOpen: () => void;
};

export function ExamCard({
  title,
  ariaLabel,
  preview,
  metadata,
  previewClassName,
  onOpen
}: Props) {
  return (
    <div className="w-36">
      <button
        type="button"
        onClick={onOpen}
        aria-label={ariaLabel}
        className="group block w-36 rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div
          className={cn(
            "flex h-48 w-36 items-center justify-center rounded-sm border border-slate-300 bg-white shadow-xs transition-colors group-hover:border-sky-500",
            previewClassName
          )}
        >
          {preview}
        </div>
      </button>
      <div className="mt-2">
        <p className="truncate text-sm font-medium">{title}</p>
        {metadata && (
          <p className="mt-1 truncate text-xs text-muted-foreground">{metadata}</p>
        )}
      </div>
    </div>
  );
}
