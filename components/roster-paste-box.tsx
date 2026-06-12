"use client"

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onPasteRoster: (names: string[]) => void;
};

export function RosterPasteBox({ className, onPasteRoster }: Props) {
  async function pasteRoster() {
    try {
      const names = parseRosterPaste(await navigator.clipboard.readText());

      if (names.length === 0) {
        return;
      }

      onPasteRoster(names);
    } catch (error) {
      console.warn("Unable to read roster from clipboard:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={pasteRoster}
      className={cn(
        "flex h-10 w-full items-center justify-center rounded-md bg-primary px-3 text-sm text-primary-foreground shadow-xs hover:bg-primary/80",
        className
      )}
    >
      Paste Class Roster from Excel
    </button>
  );
}

function parseRosterPaste(text: string) {
  return text
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split("\t").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length > 0 && !isRosterHeader(cells))
    .map((cells) => normalizeRosterName(cells))
    .filter(Boolean);
}

function isRosterHeader(cells: string[]) {
  const headerText = cells.join(" ").toLowerCase();

  return headerText.includes("first") && (headerText.includes("last") || headerText.includes("name"));
}

function normalizeRosterName(cells: string[]) {
  if (cells.length >= 2) {
    return `${cells[0]} ${cells[1]}`.replace(/\s+/g, " ").trim().toUpperCase();
  }

  const name = cells[0].replace(/\s+/g, " ").trim();

  if (!name.includes(",")) {
    return name.toUpperCase();
  }

  const [lastName, firstName] = name.split(",").map((part) => part.trim());

  return [firstName, lastName].filter(Boolean).join(" ").toUpperCase();
}
