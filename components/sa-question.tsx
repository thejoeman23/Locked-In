"use client"

import { QuestionCard } from "@/components/question-card";
import { SAQuestion as SAQuestionType } from "@/lib/exam-layout";

type Props = {
  question: SAQuestionType;
  teacherView: boolean;
  className?: string;
  studentAction?: React.ReactNode;
  onQuestionChange?: (question: SAQuestionType) => void;
  onDelete?: () => void;
};

export function SAQuestion({ question, teacherView, className, studentAction, onQuestionChange, onDelete }: Props) {
  function updateQuestion(patch: Partial<SAQuestionType>) {
    onQuestionChange?.({ ...question, ...patch });
  }

  return (
    <QuestionCard
      label="Short answer"
      worth={question.worth ?? 0}
      teacherView={teacherView}
      className={className}
      studentAction={studentAction}
      pointInputProps={{ min: 0 }}
      onWorthChange={(worth) => updateQuestion({ worth })}
      onDelete={onDelete}
    >
      {teacherView ? (
        <textarea
          value={question.text ?? ""}
          onChange={(event) => updateQuestion({ text: event.target.value })}
          placeholder="Short answer question"
          className="mt-3 min-h-20 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring"
        />
      ) : (
        <p className="mt-3 text-sm leading-6">{question.text}</p>
      )}

      <textarea
        value={teacherView ? "" : question.answer ?? ""}
        disabled={teacherView}
        onChange={(event) => updateQuestion({ answer: event.target.value })}
        placeholder={teacherView ? "Student answer area" : "Type your answer"}
        className="mt-4 min-h-24 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring disabled:bg-muted/30"
      />
    </QuestionCard>
  );
}
