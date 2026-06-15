"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteButton } from "@/components/common/delete-button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  ariaLabel: string;
  preview: ReactNode;
  metadata?: string;
  previewClassName?: string;
  alertTitle?: ReactNode;
  alertDescription?: ReactNode;
  onDelete?: () => void;
  onOpen: () => void;
};

export function ExamCard({
  title,
  ariaLabel,
  preview,
  metadata,
  previewClassName,
  alertTitle,
  alertDescription,
  onDelete,
  onOpen
}: Props) {
  const previewButton = (
    <button
      type="button"
      onClick={alertTitle || alertDescription ? undefined : onOpen}
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
  );

  return (
    <div className="w-36">
      {alertTitle || alertDescription ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {previewButton}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
              {alertDescription && (
                <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : previewButton}
      <div className="mt-2">
        <div className="flex items-center gap-1.5">
          <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
          {onDelete && (
            <DeleteButton
              triggersAlert
              label={`Delete ${title}`}
              alertDescription="This will permanently delete this saved exam from this browser."
              onClick={onDelete}
              className="size-6 shrink-0 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            />
          )}
        </div>
        {metadata && (
          <p className="mt-1 truncate text-xs text-muted-foreground">{metadata}</p>
        )}
      </div>
    </div>
  );
}
