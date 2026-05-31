"use client"

import { Field, FieldDescription, FieldTitle } from "./ui/field";
import { Input } from "./ui/input";
import { Exam } from "@/app/teacher/page";

type Props = { exam: Exam; updateExam: (exam: Exam) => void };
export function TeacherInput({ exam, updateExam }: Props) {

  function onInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const newExam = { ...exam }
    newExam.title = e.target.value
    updateExam(newExam)
  }

  return (
    <Field className="w-500 max-w-sm">
      <FieldTitle>Test Text</FieldTitle>
      <FieldDescription>Enter your test text.</FieldDescription>
      <Input onBlur={onInputChanged} placeholder="text" />
    </Field>
  );
}
