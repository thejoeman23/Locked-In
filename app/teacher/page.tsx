"use client";

import { FileText, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultTemplate from "@/exam_templates/default.json";
import mockTemplate from "@/exam_templates/mock.json";
import { ExamCard } from "@/components/teacher/exam-card";
import type { Exam } from "@/lib/exam-layout";
import { localTeacherStorage } from "@/lib/local-teacher-storage";
import { generateExamID, NewExam } from "@/lib/utils";

type TemplateTile = {
  title: string;
  icon: React.ReactNode;
  createExam: () => Exam;
};

const templateTiles: TemplateTile[] = [
  {
    title: "Blank exam",
    icon: <Plus className="size-12 text-sky-600" strokeWidth={2.5} />,
    createExam: () => withNewExamId(NewExam(), "Untitled exam")
  },
  {
    title: "Sample exam",
    icon: <FileText className="size-12 text-sky-600" strokeWidth={2.2} />,
    createExam: () => withNewExamId(defaultTemplate as Exam, "Sample exam")
  },
  {
    title: "ENG3UI mock",
    icon: <FileText className="size-12 text-emerald-600" strokeWidth={2.2} />,
    createExam: () => withNewExamId(mockTemplate as Exam)
  },
  {
    title: "Create from PDF",
    icon: <Upload className="size-12 text-slate-500" strokeWidth={2.2} />,
    createExam: () => withNewExamId(NewExam(), "Imported PDF exam")
  }
];

export default function TeacherHome() {
  const router = useRouter();
  const [recentExams, setRecentExams] = useState<Exam[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadRecentExams() {
      const exams = await localTeacherStorage.listExams();

      if (isMounted) {
        setRecentExams([...exams].reverse());
      }
    }

    loadRecentExams();

    return () => {
      isMounted = false;
    };
  }, []);

  async function createExam(createExamFromTemplate: () => Exam) {
    const exam = createExamFromTemplate();
    await localTeacherStorage.saveExam(exam);
    router.push(`/teacher/${exam.id}`);
  }

  function openExam(exam: Exam) {
    router.push(`/teacher/${exam.id}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <div className="flex size-9 items-center justify-center rounded-md bg-sky-600 text-white">
              <FileText className="size-5" />
            </div>
            <h1 className="text-xl font-medium">Locked In</h1>
          </Link>
        </div>
      </header>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h2 className="text-base font-medium">Create a new exam</h2>
          <div className="mt-5 grid grid-cols-[repeat(auto-fill,9rem)] gap-4">
            {templateTiles.map((template) => (
              <ExamCard
                key={template.title}
                title={template.title}
                ariaLabel={`Create ${template.title}`}
                preview={template.icon}
                onOpen={() => createExam(template.createExam)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-base font-medium">Recent exams</h2>
        {recentExams.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed bg-slate-50 px-6 py-12 text-center text-sm text-muted-foreground">
            No recent exams yet.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-[repeat(auto-fill,9rem)] gap-4">
            {recentExams.map((exam) => (
              <ExamCard
                key={exam.id}
                title={exam.title || "Untitled exam"}
                ariaLabel={`Open ${exam.title || "Untitled exam"}`}
                preview={<FileText className="size-14 text-sky-600" strokeWidth={1.8} />}
                metadata={getExamSummary(exam)}
                previewClassName="bg-slate-50"
                onOpen={() => openExam(exam)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function withNewExamId(template: Exam, fallbackTitle?: string): Exam {
  return {
    ...structuredClone(template),
    id: generateExamID(),
    last_updated: new Date().toISOString(),
    title: template.title || fallbackTitle || "Untitled exam",
    status: "setup",
    teacher_mode: "edit"
  };
}

function getExamSummary(exam: Exam) {
  const sectionCount = exam.content.length;
  const questionCount = exam.content.reduce((total, section) => total + section.items.length, 0);

  return `${sectionCount} ${sectionCount === 1 ? "section" : "sections"} · ${questionCount} ${questionCount === 1 ? "question" : "questions"}`;
}
