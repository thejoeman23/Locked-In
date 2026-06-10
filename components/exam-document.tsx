"use client"

import { useState } from "react";
import { BookOpen, Highlighter, ListChecks, MessageSquareText, Trash2 } from "lucide-react";
import { DocumentAddButton } from "@/components/document-add-button";
import { ExamSection } from "@/components/exam-section";
import { ExamTitle } from "@/components/exam-title";
import { HighlightWordQuestion } from "@/components/highlight-word-question";
import { MMCQuestion } from "@/components/mmc-question";
import { SAQuestion } from "@/components/sa-question";
import { StarButton } from "@/components/star";
import {
  Exam,
  ExamQuestion,
  MMCQuestion as MMCQuestionType,
  SAQuestion as SAQuestionType,
  Section,
  UnderlineQuestion
} from "@/lib/exam-layout";
import { cn } from "@/lib/utils";

type Props = {
  exam: Exam;
  teacherView: boolean;
  className?: string;
  onExamChange?: (exam: Exam) => void;
};

type ActiveItem =
  | { type: "document" }
  | { type: "section"; sectionIndex: number }
  | { type: "question"; sectionIndex: number; questionIndex: number };

const DELETE_ANIMATION_MS = 180;

export function ExamDocument({
  exam,
  teacherView,
  className,
  onExamChange
}: Props) {
  const [activeItem, setActiveItem] = useState<ActiveItem>({ type: "document" });
  const [deletingItem, setDeletingItem] = useState<ActiveItem | null>(null);

  // Every edit creates a new Exam object so the visible document is always redrawn from data.
  function updateExamTitle(title: string) {
    onExamChange?.({ ...exam, title });
  }

  // Replace one section while preserving all other sections.
  function updateSection(sectionIndex: number, section: Section) {
    const content = [...exam.content];
    content[sectionIndex] = section;
    onExamChange?.({ ...exam, content });
  }

  // Replace one question inside one section while leaving the rest of the Exam untouched.
  function updateQuestion(sectionIndex: number, questionIndex: number, question: ExamQuestion) {
    const section = exam.content[sectionIndex];
    const items = [...section.items];
    items[questionIndex] = question;
    updateSection(sectionIndex, { ...section, items });
  }

  function toggleQuestionStar(sectionIndex: number, questionIndex: number, question: ExamQuestion) {
    updateQuestion(sectionIndex, questionIndex, {
      ...question,
      starred: !question.starred
    });
  }

  function addSection() {
    const content = [...exam.content];
    const insertIndex = activeItem.type === "document" ? content.length : activeItem.sectionIndex + 1;

    content.splice(insertIndex, 0, {
      title: "",
      items: []
    });

    setActiveItem({ type: "section", sectionIndex: insertIndex });
    onExamChange?.({ ...exam, content });
  }

  // Add questions near the active item: after the active question, or at the end of the active section.
  function addQuestion(question: ExamQuestion) {
    const content = exam.content.map((section) => ({
      ...section,
      items: [...section.items]
    }));
    let sectionIndex = activeItem.type === "document" ? content.length - 1 : activeItem.sectionIndex;

    if (sectionIndex < 0) {
      content.push({
        title: "New section",
        items: []
      });
      sectionIndex = 0;
    }

    const section = content[sectionIndex];
    const insertIndex = activeItem.type === "question"
      ? activeItem.questionIndex + 1
      : section.items.length;

    section.items.splice(insertIndex, 0, question);
    setActiveItem({ type: "question", sectionIndex, questionIndex: insertIndex });
    onExamChange?.({ ...exam, content });
  }

  function addMMCQuestion() {
    addQuestion({
      text: "",
      worth: 1,
      starred: false,
      options: ["Option A", "Option B", "Option C"],
      answer: null,
      correctOption: 0
    });
  }

  function addSAQuestion() {
    addQuestion({
      text: "",
      worth: 1,
      starred: false,
      answer: null
    });
  }

  function addHighlightQuestion() {
    addQuestion({
      text: "",
      passage: "",
      worth: 1,
      starred: false,
      answer: null,
      correctOptions: []
    });
  }

  // Mark first, remove after the CSS exit animation finishes.
  function deleteItem(item: ActiveItem) {
    if (item.type === "document" || deletingItem) {
      return;
    }

    setDeletingItem(item);

    window.setTimeout(() => {
      const content = exam.content.map((section) => ({
        ...section,
        items: [...section.items]
      }));

      if (item.type === "section") {
        content.splice(item.sectionIndex, 1);
        setActiveItem({ type: "document" });
      } else {
        content[item.sectionIndex]?.items.splice(item.questionIndex, 1);
        setActiveItem({ type: "section", sectionIndex: item.sectionIndex });
      }

      setDeletingItem(null);
      onExamChange?.({ ...exam, content });
    }, DELETE_ANIMATION_MS);
  }

  // Active checks are centralized so section/question highlighting and control placement stay consistent.
  function isActive(item: ActiveItem) {
    if (activeItem.type !== item.type) {
      return false;
    }

    switch (activeItem.type) {
      case "document":
        return true;
      case "section":
        return item.type === "section" && activeItem.sectionIndex === item.sectionIndex;
      case "question":
        return (
          item.type === "question" &&
          activeItem.sectionIndex === item.sectionIndex &&
          activeItem.questionIndex === item.questionIndex
        );
    }
  }

  function isDeleting(item: ActiveItem) {
    if (!deletingItem || deletingItem.type !== item.type) {
      return false;
    }

    if (item.type === "document") {
      return true;
    }

    if (item.type === "section") {
      return deletingItem.type === "section" && deletingItem.sectionIndex === item.sectionIndex;
    }

    return (
      deletingItem.type === "question" &&
      deletingItem.sectionIndex === item.sectionIndex &&
      deletingItem.questionIndex === item.questionIndex
    );
  }

  // Pick the correct question component based on the shape of the question data.
  function renderExamQuestion(sectionIndex: number, question: ExamQuestion, questionIndex: number) {
    const questionId = `section-${sectionIndex}-question-${questionIndex}`;
    const item: ActiveItem = { type: "question", sectionIndex, questionIndex };
    const studentAction = !teacherView ? (
      <StarButton
        filled={Boolean(question.starred)}
        aria-label={question.starred ? "Unstar question" : "Star question"}
        title={question.starred ? "Unstar question" : "Star question"}
        onClick={() => toggleQuestionStar(sectionIndex, questionIndex, question)}
      />
    ) : undefined;
    const questionComponent = isMMCQuestion(question) ? (
      <MMCQuestion
        question={question}
        questionId={questionId}
        teacherView={teacherView}
        studentAction={studentAction}
        onDelete={isActive(item) ? () => deleteItem(item) : undefined}
        onQuestionChange={(updatedQuestion) => updateQuestion(sectionIndex, questionIndex, updatedQuestion)}
      />
    ) : isHighlightQuestion(question) ? (
      <HighlightWordQuestion
        question={question}
        teacherView={teacherView}
        studentAction={studentAction}
        onDelete={isActive(item) ? () => deleteItem(item) : undefined}
        onQuestionChange={(updatedQuestion) => updateQuestion(sectionIndex, questionIndex, updatedQuestion)}
      />
    ) : (
      <SAQuestion
        question={question as SAQuestionType}
        teacherView={teacherView}
        studentAction={studentAction}
        onDelete={isActive(item) ? () => deleteItem(item) : undefined}
        onQuestionChange={(updatedQuestion) => updateQuestion(sectionIndex, questionIndex, updatedQuestion)}
      />
    );

    if (!teacherView) {
      return <div key={questionId}>{questionComponent}</div>;
    }

    return (
      <div
        key={questionId}
        onClick={(event) => {
          event.stopPropagation();
          setActiveItem(item);
        }}
        onFocus={(event) => {
          event.stopPropagation();
          setActiveItem(item);
        }}
        className="rounded-lg"
      >
        <div
          className={cn(
            "exam-card-motion rounded-lg transition-colors",
            isActive(item) && "ring-2 ring-sky-200"
          )}
          data-deleting={isDeleting(item) || undefined}
        >
          {questionComponent}
        </div>
        {renderAddControlsRow(isActive(item) && !isDeleting(item))}
      </div>
    );
  }

  // Draw a section from its Section object, then place contextual controls under it when active.
  function renderExamSection(section: Section, sectionIndex: number) {
    const item: ActiveItem = { type: "section", sectionIndex };
    const sectionContent = (
      <ExamSection
        section={section}
        teacherView={teacherView}
        titleAction={isActive(item) && (
          <button
            type="button"
            aria-label="Delete section"
            onClick={(event) => {
              event.stopPropagation();
              deleteItem(item);
            }}
            className="inline-flex size-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          >
            <Trash2 className="size-4" />
          </button>
        )}
        onTitleChange={(title) => updateSection(sectionIndex, { ...section, title })}
      >
        {section.items.map((question, questionIndex) => (
          renderExamQuestion(sectionIndex, question, questionIndex)
        ))}
      </ExamSection>
    );

    if (!teacherView) {
      return <div key={`section-${sectionIndex}`}>{sectionContent}</div>;
    }

    return (
      <div
        key={`section-${sectionIndex}`}
        onClick={() => setActiveItem(item)}
        onFocus={() => setActiveItem(item)}
        className="rounded-lg"
      >
        <div
          className={cn(
            "exam-card-motion rounded-lg border border-transparent p-4 transition-colors hover:border-slate-200 hover:bg-slate-50/60",
            isActive(item) && "border-sky-200 bg-sky-50/40"
          )}
          data-deleting={isDeleting(item) || undefined}
        >
          {sectionContent}
        </div>
        {renderAddControlsRow(isActive(item) && !isDeleting(item))}
      </div>
    );
  }

  function renderExamSections() {
    if (exam.content.length === 0) {
      return (
        <div className="rounded-md border border-dashed bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          {teacherView ? "Add a section or question to start building the exam." : "This exam has no questions yet."}
        </div>
      );
    }

    return exam.content.map(renderExamSection);
  }

  // Reused control group; its placement changes depending on the active item.
  function renderAddControls() {
    return (
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
        <DocumentAddButton icon={<BookOpen className="size-4" />} onClick={addSection}>
          Add section
        </DocumentAddButton>
        <DocumentAddButton icon={<ListChecks className="size-4" />} onClick={addMMCQuestion}>
          Add multiple choice
        </DocumentAddButton>
        <DocumentAddButton icon={<MessageSquareText className="size-4" />} onClick={addSAQuestion}>
          Add short answer
        </DocumentAddButton>
        <DocumentAddButton icon={<Highlighter className="size-4" />} onClick={addHighlightQuestion}>
          Add highlight word
        </DocumentAddButton>
      </div>
    );
  }

  function renderAddControlsRow(visible: boolean) {
    if (!teacherView) {
      return null;
    }

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        onFocus={(event) => event.stopPropagation()}
        className={cn(
          "flex justify-center overflow-hidden transition-[max-height,opacity,transform,margin-top] duration-200 ease-out",
          visible ? "mt-4 max-h-12 translate-y-0 opacity-100" : "mt-0 max-h-0 -translate-y-1 opacity-0 pointer-events-none"
        )}
        aria-hidden={!visible}
      >
        {renderAddControls()}
      </div>
    );
  }

  return (
    <article
      className={cn(
        "min-h-[880px] w-full max-w-[816px] bg-white px-16 py-12 shadow-sm ring-1 ring-black/10",
        className
      )}
    >
      <div className="mx-auto max-w-xl border-b border-slate-200 pb-6 text-center">
        <ExamTitle
          title={exam.title}
          teacherView={teacherView}
          className="h-auto w-full px-0 text-center text-3xl"
          onTitleChange={updateExamTitle}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {exam.content.length} {exam.content.length === 1 ? "section" : "sections"} · {countQuestions(exam)}{" "}
          {countQuestions(exam) === 1 ? "question" : "questions"}
        </p>
      </div>

      <div className="mt-8 space-y-10">{renderExamSections()}</div>

      {teacherView && (
        <div
          className={cn(
            "overflow-hidden border-t border-slate-200 transition-[max-height,opacity,margin-top,padding-top] duration-200 ease-out",
            activeItem.type === "document" ? "mt-10 max-h-24 pt-6 opacity-100" : "mt-0 max-h-0 pt-0 opacity-0"
          )}
          aria-hidden={activeItem.type !== "document"}
        >
          {renderAddControlsRow(activeItem.type === "document")}
        </div>
      )}
    </article>
  );
}

function countQuestions(exam: Exam) {
  return exam.content.reduce((total, section) => total + section.items.length, 0);
}

function isMMCQuestion(question: ExamQuestion): question is MMCQuestionType {
  return "options" in question;
}

function isHighlightQuestion(question: ExamQuestion): question is UnderlineQuestion {
  return "correctOptions" in question;
}
