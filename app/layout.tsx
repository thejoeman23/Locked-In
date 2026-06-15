import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Locked-In: English Exams made right.",
  description: "The best way to make, take, and mark English Exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <div className="hidden md:contents">
          {children}
        </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-700 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:36px_36px] px-6 md:hidden">
          <div className="w-full max-w-sm rounded-xl border border-white/20 bg-white p-6 text-center text-slate-950 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-sky-700">
              Desktop required
            </p>
            <h1 className="mt-3 text-3xl font-bold">Locked In is not available on mobile.</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Please open this website on a desktop or laptop to create, take, or manage exams.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
