// The socket server and client pages share these types so event payloads stay aligned.
export interface Student {
    // Current Socket.IO id. This is useful live, but not stable across reconnects.
    socket: string;
    name: string;
    // A per-student exam copy leaves room for personalized ordering/accommodations.
    uniqueExam: Exam;
    connected: boolean;
    completed: boolean;
}

export interface ActiveExam {
    // Original exam configuration created by the teacher.
    exam: Exam;
    students: Student[];
    // Expected student names/codes for admission control when that feature lands.
    roster: string[];
}

export interface Exam {
    title: string;
    // High-level lifecycle used by the teacher button and socket events.
    status: "setup" | "waiting" | "live" | "terminated";
    content: Section[];
}

export interface Section {
    title: string;
    items: ExamQuestion[];
}

export interface Question {
    text: string;
    worth: number;
}

export type ExamQuestion = MMCQuestion | SAQuestion | UnderlineQuestion;

export interface MMCQuestion extends Question {
    options: string[];
    answer: number | null;
    correctOption: number;
}

export interface SAQuestion extends Question {
    answer: string | null;
}

export interface UnderlineQuestion extends Question {
    passage: string;
    answer: number[] | null;
    correctOptions: number[];
}
