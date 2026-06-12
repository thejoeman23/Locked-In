"use client"

import { QuestionCard } from "@/components/exam/question-card";
import { UnderlineQuestion } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  question: UnderlineQuestion;
  teacherView: boolean;
  className?: string;
  studentAction?: React.ReactNode;
  onQuestionChange?: (question: UnderlineQuestion) => void;
  onDelete?: () => void;
};

export function HighlightWordQuestion({ question, teacherView, className, studentAction, onQuestionChange, onDelete }: Props) {
  const selectedWords = teacherView ? question.correctOptions ?? [] : question.answer ?? [];
  const words = (question.passage ?? "").split(/\s+/).filter(Boolean);

  function toggleWord(index: number) {
    const selection = selectedWords.includes(index)
      ? selectedWords.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedWords, index];

    onQuestionChange?.(teacherView ? { ...question, correctOptions: selection } : { ...question, answer: selection });
  }

  return (
    <QuestionCard
      label="Highlight words"
      worth={question.worth ?? 0}
      teacherView={teacherView}
      className={className}
      studentAction={studentAction}
      pointInputProps={{ min: 0 }}
      onWorthChange={(worth) => onQuestionChange?.({ ...question, worth })}
      onDelete={onDelete}
    >
      {teacherView ? (
        <div className="mt-3 space-y-3">
          <textarea
            value={question.text ?? ""}
            onChange={(event) => onQuestionChange?.({ ...question, text: event.target.value })}
            placeholder="i.e. Highlight the nouns in the following quotation."
            className="min-h-16 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring"
          />
          <textarea
            value={question.passage ?? ""}
            onChange={(event) => onQuestionChange?.({ ...question, passage: event.target.value, correctOptions: [] })}
            placeholder="Quotation or passage"
            className="min-h-24 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring"
          />
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6">{question.text}</p>
      )}

      <div className="mt-4 rounded-md border bg-muted/20 p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {teacherView ? "Click words to mark the answer" : "Click words to highlight"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm leading-7">
          {words.length === 0 ? (
            <span className="text-muted-foreground">Add a quotation to generate words.</span>
          ) : (
            words.map((word, index) => (
              <button
                key={`${word}-${index}`}
                type="button"
                onClick={() => toggleWord(index)}
                className={cn(
                  "rounded px-2 py-1 transition-colors",
                  selectedWords.includes(index)
                    ? teacherView
                      ? "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-200"
                      : "bg-yellow-200 text-yellow-950"
                    : "hover:bg-background"
                )}
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>
    </QuestionCard>
  );
}
