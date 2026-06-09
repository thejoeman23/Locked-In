import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateExamCode(activeExams: Map<string, unknown>): string {
    // Eight characters gives a small, readable classroom code while checking collisions.
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code: string;

    do {
        code = "";

        for (let i = 0; i < 8; i++) {
            code += chars[
                Math.floor(Math.random() * chars.length)
            ];
        }
    } while (activeExams.has(code));

    return code;
}
