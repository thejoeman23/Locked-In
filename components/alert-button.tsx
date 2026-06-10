"use client"

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type AlertButtonProps = React.ComponentProps<typeof Button> & {
  alertTitle: React.ReactNode;
  alertDescription?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmVariant?: React.ComponentProps<typeof AlertDialogAction>["variant"];
  triggersAlert?: boolean;
};

export function AlertButton({
  alertTitle = "Are you absolutely sure?",
  alertDescription,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant,
  triggersAlert = true,
  onClick,
  children,
  ...buttonProps
}: AlertButtonProps) {
  if (!triggersAlert) {
    return (
      <Button onClick={onClick} {...buttonProps}>
        {children}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          {alertDescription && (
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onClick={onClick}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
