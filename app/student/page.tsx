import { Field, FieldTitle, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Field className="w-500 max-w-sm">
        <FieldTitle>Exam Code</FieldTitle>
        <FieldDescription>Enter your exam code.</FieldDescription>
        <Input placeholder="0000-0000" />
      </Field>
    </main>
  );
}
