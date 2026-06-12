"use client"

import { QuestionCard } from "@/components/exam/question-card";
import { MMCQuestion as MMCQuestionType } from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  question: MMCQuestionType;
  teacherView: boolean;
  questionId?: string;
  className?: string;
  studentAction?: React.ReactNode;
  onQuestionChange?: (question: MMCQuestionType) => void;
  onDelete?: () => void;
};

export function MMCQuestion({ question, teacherView, questionId, className, studentAction, onQuestionChange, onDelete }: Props) {
  function updateQuestion(patch: Partial<MMCQuestionType>) {
    onQuestionChange?.({ ...question, ...patch });
  }

  function updateOption(index: number, option: string) {
    const options = [...question.options];
    options[index] = option;
    updateQuestion({ options });
  }

  function addOption() {
    updateQuestion({ options: [...question.options, `Option ${question.options.length + 1}`] });
  }

  function removeOption(index: number) {
    const options = question.options.filter((_, optionIndex) => optionIndex !== index);
    const correctOption = question.correctOption >= options.length ? Math.max(options.length - 1, 0) : question.correctOption;
    const answer = question.answer === index
      ? null
      : question.answer !== null && question.answer > index
        ? question.answer - 1
        : question.answer;

    updateQuestion({ options, correctOption, answer });
  }

  return (
    <QuestionCard
      label="Multiple choice"
      worth={question.worth ?? 1}
      teacherView={teacherView}
      className={className}
      studentAction={studentAction}
      pointInputClassName="field-sizing-content"
      pointInputProps={{ max: 100 }}
      onWorthChange={(worth) => updateQuestion({ worth })}
      onDelete={onDelete}
    >
      {teacherView ? (
        <textarea
          value={question.text ?? ""}
          onChange={(event) => updateQuestion({ text: event.target.value })}
          placeholder="Multiple choice question"
          className="mt-3 min-h-20 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-6 outline-none focus:border-ring"
        />
      ) : (
        <p className="mt-3 text-sm leading-6">{question.text}</p>
      )}

      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={cn(
              "flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-muted",
              teacherView && question.correctOption === index && "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200"
            )}
          >
            <input
              type="radio"
              name={teacherView ? `${questionId}-correct` : questionId}
              aria-label={teacherView ? `Mark option ${index + 1} as correct` : `Select option ${index + 1}`}
              checked={teacherView ? question.correctOption === index : question.answer === index}
              onChange={() => updateQuestion(teacherView ? { correctOption: index } : { answer: index })}
              className={teacherView ? "accent-emerald-600" : undefined}
            />
            {teacherView ? (
              <input
                value={option ?? ""}
                onChange={(event) => updateOption(index, event.target.value)}
                className={cn(
                  "flex-1 rounded-md border bg-transparent px-2 py-1 outline-none focus:border-ring",
                  question.correctOption === index && "border-emerald-300 bg-white/70"
                )}
              />
            ) : (
              <span>{option}</span>
            )}
            {teacherView && question.options.length > 1 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Remove
              </button>
            )}
          </label>
        ))}
      </div>

      {teacherView && (
        <button
          type="button"
          onClick={addOption}
          className="mt-3 rounded-md border px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Add option
        </button>
      )}
    </QuestionCard>
  );
}
