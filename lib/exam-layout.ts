export interface Exam {
    title: string;
    status: "setup" | "waiting" | "running" | "ended";
    content: Section[];
}

export interface Section {
    title: string;
    items: Question[];
}

export interface Question {
    text: string;
    worth: number;
}

export interface MMCQuestion extends Question {
    options: string[];
    answer: number | null;
    correctOption: number;
}

export interface SAQuestion extends Question {
    answer: string | null;
}

export interface UnderlineQuestion extends Question {
    answer: number[] | null;
    correctOptions: number[];
}