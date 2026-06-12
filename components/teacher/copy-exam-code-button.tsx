"use client"

import { useEffect, useState } from "react";
import { CircleCheck, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  examCode: string | null;
  className?: string;
};

export function CopyExamCodeButton({ examCode, className }: Props) {
  const [copiedExamCode, setCopiedExamCode] = useState(false);
  const codeCharacters = Array.from({ length: 6 }, (_, index) => examCode?.[index] ?? "");

  useEffect(() => {
    if (!copiedExamCode) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedExamCode(false), 1100);

    return () => window.clearTimeout(timeout);
  }, [copiedExamCode]);

  async function copyExamCode() {
    if (!examCode) {
      return;
    }

    await navigator.clipboard.writeText(examCode);
    setCopiedExamCode(true);
  }

  return (
    <button
      type="button"
      onClick={copyExamCode}
      disabled={!examCode}
      aria-label={examCode ? `Copy exam code ${examCode}` : "Exam code not revealed yet"}
      title={examCode ? "Copy exam code" : "Exam code not revealed yet"}
      className={cn(
        "group flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-sky-200 bg-sky-50 px-6 py-6 text-sky-700 transition-colors duration-500 ease-out hover:bg-sky-100 disabled:cursor-not-allowed disabled:hover:bg-sky-50",
        className
      )}
    >
      <span className="text-base font-md text-sky-900/70">Exam join code</span>
      <span className="flex items-center justify-center gap-4">
        <span className="flex justify-center gap-4" aria-hidden="true">
          {codeCharacters.map((character, index) => (
            <span
              key={index}
              className="flex h-16 w-12 items-center justify-center border-b-2 border-current text-center text-5xl font-black"
            >
              <span
                className={cn(
                  "transition-opacity duration-500 ease-out",
                  examCode ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: examCode ? `${index * 45}ms` : "0ms" }}
              >
                {character}
              </span>
            </span>
          ))}
        </span>
        <span className="relative size-6 mb-4 opacity-80 transition-opacity duration-500 ease-out group-disabled:opacity-0">
          <Copy className={cn("absolute inset-0 size-10", copiedExamCode ? "scale-90 opacity-0" : "scale-100 opacity-100")} />
          <CircleCheck className={cn("absolute inset-0 size-10", copiedExamCode ? "scale-100 opacity-100" : "scale-90 opacity-0")} />
        </span>
      </span>
    </button>
  );
}
