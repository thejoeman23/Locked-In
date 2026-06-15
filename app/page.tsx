import Link from "next/link";
import { ArrowRight, GraduationCap, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-slate-950">
      <section className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center bg-sky-700 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:44px_44px] px-6 py-16 text-white sm:px-10">
          <div className="mx-auto w-full max-w-4xl text-center">
            <p className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-50 shadow-sm">
              The clearest place to create, take, and mark online exams.
            </p>
            <div className="relative mx-auto w-fit max-w-full">
              <h1 className="text-7xl font-bold leading-none tracking-normal drop-shadow-sm sm:text-8xl lg:text-9xl" style={{ fontFamily: '"Snell Roundhand", "Apple Chancery", "Segoe Script", "Brush Script MT", cursive' }}>
                Locked In
              </h1>
              <span className="absolute bottom-2 left-full ml-3 rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-sm font-semibold uppercase tracking-normal text-orange-800 shadow-sm max-sm:bottom-1 max-sm:ml-1.5 max-sm:px-2 max-sm:text-xs">
                Beta
              </span>
            </div>
            <p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-sky-50 sm:text-2xl">
              A simple exam workspace for teachers and students, built around join codes, live classroom exams, and clean submissions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-center text-lg font-semibold text-slate-800">I am a</p>
            <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
              <Button asChild size="lg" className="h-16 rounded-lg bg-sky-600 px-5 text-lg font-semibold text-white shadow-md hover:bg-sky-700">
                <Link href="/student" className="justify-between">
                  <span className="inline-flex items-center gap-3">
                    <GraduationCap className="size-6" />
                    Student
                  </span>
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 rounded-lg border-emerald-200 bg-emerald-50 px-5 text-lg font-semibold text-emerald-900 hover:bg-emerald-100">
                <Link href="/teacher" className="justify-between">
                  <span className="inline-flex items-center gap-3">
                    <PenLine className="size-5" />
                    Teacher
                  </span>
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
