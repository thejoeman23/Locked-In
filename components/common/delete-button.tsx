"use client"

import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertButton } from "@/components/common/alert-button";

type Props = Omit<React.ComponentProps<"button">, "children"> & {
  label?: string;
  triggersAlert?: boolean;
  alertDescription?: string;
};

export function DeleteButton({
  label = "Delete",
  className,
  onClick,
  type = "button",
  triggersAlert = false,
  alertDescription,
  ...props
}: Props) {
  return (
    <AlertButton
      triggersAlert={triggersAlert}
      alertDescription={alertDescription}
      type={type}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        className
      )}
      {...props}
    >
      <Trash2 className="size-4" />
    </AlertButton>
  );
}
