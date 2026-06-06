"use client"

import { Button } from "./ui/button";
import { Exam } from "@/lib/exam-layout";

type Props = React.ComponentProps<typeof Button> & { exam: Exam; updateExam: (exam: Exam) => void; };
export function TeacherButton({ exam, updateExam, ...props }: Props) {

  function handleButton() {
    const newExam = { ...exam }

    // The button is a simple state machine for the teacher's exam lifecycle.
    if (exam.status === "setup") {
      newExam.status = "waiting"
    } else if (exam.status === "waiting") {
      newExam.status = "live"
    } else if (exam.status === "live") {
      newExam.status = "terminated"
    }

    updateExam(newExam)
  }

  return (
    <Button onClick={handleButton} {...props}>
      {exam.status === "setup" && "Reveal Code"}
      {exam.status === "waiting" && "Start Exam"}
      {exam.status === "live" && "End Exam"}
      {exam.status === "terminated" && "Exam Terminated"}
    </Button>
  );
}
