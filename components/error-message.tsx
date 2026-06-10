"use client"

import { cn } from "@/lib/utils";

type Props = {
  message: string | null;
  className?: string;
};

export function ErrorMessage({ message, className }: Props) {
  return (
    <p className={cn("error-message-fade min-h-4 text-center text-xs text-red-600", className)}>
      {message ?? ""}
    </p>
  );
}
