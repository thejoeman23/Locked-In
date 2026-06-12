"use client"

import { Plus } from "lucide-react";
import { DeleteButton } from "@/components/common/delete-button";
import { QuestionCard } from "@/components/exam/question-card";
import { DefenitionsTableQuestion as DefenitionsTableQuestionType } from "@/lib/exam-layout";

type Props = {
  question: DefenitionsTableQuestionType;
  teacherView: boolean;
  className?: string;
  studentAction?: React.ReactNode;
  onQuestionChange?: (question: DefenitionsTableQuestionType) => void;
  onDelete?: () => void;
};

export function DefenitionsTableQuestion({
  question,
  teacherView,
  className,
  studentAction,
  onQuestionChange,
  onDelete
}: Props) {
  const rows = getRows(question);

  function updateQuestion(patch: Partial<DefenitionsTableQuestionType>) {
    onQuestionChange?.({ ...question, ...patch });
  }

  function updateRow(index: number, patch: Partial<DefinitionRow>) {
    const nextRows = rows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, ...patch } : row
    ));

    updateQuestion(rowsToQuestionPatch(nextRows));
  }

  function addRow() {
    updateQuestion(rowsToQuestionPatch([
      ...rows,
      { defenition: "", correctAnswer: "", answer: "" }
    ]));
  }

  function removeRow(index: number) {
    const nextRows = rows.filter((_, rowIndex) => rowIndex !== index);
    updateQuestion(rowsToQuestionPatch(nextRows.length > 0 ? nextRows : [
      { defenition: "", correctAnswer: "", answer: "" }
    ]));
  }

  return (
    <QuestionCard
      label="Definitions table"
      worth={question.worth ?? 1}
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
          placeholder="Question prompt"
          className="mt-3 min-h-16 w-full resize-none rounded-md border border-slate-300 bg-white p-3 text-sm leading-6 outline-none focus:border-ring"
        />
      ) : question.text ? (
        <p className="mt-3 text-sm leading-6">{question.text}</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-md border border-slate-300 bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,14rem)_2.5rem] border-b border-slate-300 bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-700">
          <div className="px-3 py-2">Definition</div>
          <div className="border-l border-slate-300 px-3 py-2">{teacherView ? "Correct answer" : "Answer"}</div>
          <div className="border-l border-slate-300" />
        </div>

        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,14rem)_2.5rem] border-b border-slate-200 last:border-b-0"
          >
            <div className="min-w-0 p-2">
              {teacherView ? (
                <textarea
                  value={row.defenition}
                  onChange={(event) => updateRow(index, { defenition: event.target.value })}
                  placeholder="Definition"
                  className="min-h-16 w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm leading-5 outline-none focus:border-ring"
                />
              ) : (
                <p className="min-h-16 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm leading-5 text-slate-900">{row.defenition}</p>
              )}
            </div>

            <div className="min-w-0 border-l border-slate-200 p-2">
              <input
                value={teacherView ? row.correctAnswer : row.answer}
                onChange={(event) => updateRow(index, teacherView ? { correctAnswer: event.target.value } : { answer: event.target.value })}
                placeholder={teacherView ? "Correct answer" : "Your answer"}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-ring"
              />
            </div>

            <div className="flex items-center justify-center border-l border-slate-200 bg-slate-50/70">
              {teacherView && (
                <DeleteButton
                  label={`Delete definition row ${index + 1}`}
                  onClick={() => removeRow(index)}
                  className="size-8"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {teacherView && (
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        >
          <Plus className="size-3.5" />
          Add row
        </button>
      )}
    </QuestionCard>
  );
}

type DefinitionRow = {
  defenition: string;
  correctAnswer: string;
  answer: string;
};

function getRows(question: DefenitionsTableQuestionType): DefinitionRow[] {
  const rowCount = Math.max(
    1,
    question.defenitions.length,
    question.correctAnswers.length,
    question.answers.length
  );

  return Array.from({ length: rowCount }, (_, index) => ({
    defenition: question.defenitions[index] ?? "",
    correctAnswer: question.correctAnswers[index] ?? "",
    answer: question.answers[index] ?? ""
  }));
}

function rowsToQuestionPatch(rows: DefinitionRow[]): Pick<DefenitionsTableQuestionType, "defenitions" | "correctAnswers" | "answers"> {
  return {
    defenitions: rows.map((row) => row.defenition),
    correctAnswers: rows.map((row) => row.correctAnswer),
    answers: rows.map((row) => row.answer)
  };
}
