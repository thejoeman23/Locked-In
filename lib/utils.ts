import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Exam, Roster } from "./exam-layout";


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

export function NewExam(): Exam {
    return {
        title: "",
        id: generateExamID(),
        last_updated: new Date().toISOString(),
        status: "setup",
        content: [
            {
                title: "Sample Section",
                items: [
                    {
                        text: "This is a sample multiple choice question.",
                        worth: 1,
                        options: [
                            "This option is incorrect.",
                            "This option is correct.",
                            "This option is incorrect."
                        ],
                        correctOption: 1,
                        answer: null,
                        starred: false
                    }
                ]
            }
        ]
    };
}

export function NewRoster(name = "Untitled Roster"): Roster {
    return {
        id: generateExamID(),
        name,
        names: []
    };
}
