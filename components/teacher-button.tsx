"use client"

import { Button } from "./ui/button";
import { Exam } from "@/lib/exam-layout";

type Props = React.ComponentProps<typeof Button> & { exam: Exam; updateExam: (exam: Exam) => void; };
export function TeacherButton({ exam, updateExam, ...props }: Props) {

  function handleButton() {
    const newExam = { ...exam }
    
    if (exam.status === "setup") {
      newExam.status = "waiting"
    } else if (exam.status === "waiting") {
      newExam.status = "running"
    } else if (exam.status === "running") {
      newExam.status = "ended"
    }

    updateExam(newExam)
  }

  return (
    <Button onClick={handleButton} {...props}>
      {exam.status === "setup" && "Reveal Code"}
      {exam.status === "waiting" && "Start Exam"}
      {exam.status === "running" && "End Exam"}
      {exam.status === "ended" && "Exam Ended"}
    </Button>
  );
}
