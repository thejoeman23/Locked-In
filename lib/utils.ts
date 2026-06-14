import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateExamCode(activeExams: Map<string, unknown>): string {
    // Six characters gives a small, readable classroom code while checking collisions.
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

    let code: string;

    do {
        code = "";

        for (let i = 0; i < 6; i++) {
            code += chars[
                Math.floor(Math.random() * chars.length)
            ];
        }
    } while (activeExams.has(code));

    return code;
}

export function generateExamID(): string {
    const chars = 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";

    let id: string = ""

    for (let i = 0; i < 10; i++) {
        id += chars[
            Math.floor(Math.random() * chars.length)
        ];
    }

    return id;
}