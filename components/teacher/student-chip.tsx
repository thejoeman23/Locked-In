"use client"

import { Circle, CircleCheck, Clock3 } from "lucide-react";
import { DeleteButton } from "@/components/common/delete-button";
import { cn } from "@/lib/utils";

export type StudentDisplayState = "not-connected" | "connected" | "in-progress" | "submitted";

type Props = {
  name: string;
  state: StudentDisplayState;
  onDelete: () => void;
  kickOnly?: boolean;
};

export function StudentChip({ name, state, onDelete, kickOnly = false }: Props) {
  const Icon = {
    "not-connected": Circle,
    connected: CircleCheck,
    "in-progress": Clock3,
    submitted: CircleCheck
  }[state];

  const needsKickWarning = state === "connected" || state === "in-progress";

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded text-sm ring-1",
        state === "not-connected" && "bg-neutral-200 text-neutral-800 ring-neutral-300",
        state === "connected" && "bg-sky-50 text-sky-800 ring-sky-200",
        state === "in-progress" && "bg-amber-50 text-amber-900 ring-amber-200",
        state === "submitted" && "bg-emerald-50 text-emerald-900 ring-emerald-200"
      )}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-2 py-1"
      >
        <Icon className="size-3.5" />
        <span>{name}</span>
      </button>
      <DeleteButton
        triggersAlert={needsKickWarning}
        alertDescription={needsKickWarning ? "This action will kick this student from the exam." : undefined}
        label={kickOnly ? `Kick ${name} from exam` : `Remove ${name} from roster`}
        kickLogo={kickOnly}
        onClick={onDelete}
        className={cn(
          "size-auto rounded-none border-y-0 border-r-0 px-1.5",
          state === "not-connected" && "border-neutral-300 bg-neutral-300/60 text-neutral-800 hover:bg-neutral-300",
          state === "connected" && "border-sky-200 bg-sky-100 text-sky-800 hover:bg-sky-200",
          state === "in-progress" && "border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-200",
          state === "submitted" && "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
        )}
      />
    </div>
  );
}
