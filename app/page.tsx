import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Button asChild size="lg" className="h-12 w-40 text-base">
        <Link href="/student">Student</Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="h-12 w-40 text-base">
        <Link href="/teacher">Teacher</Link>
      </Button>
    </main>
  );
}
