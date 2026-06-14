import { Exam, Roster } from "./exam-layout";

export interface TeacherStorage {
  listExams(): Promise<Exam[]>;
  getExam(id: string): Promise<Exam | null>;
  saveExam(exam: Exam): Promise<void>;
  deleteExam(id: string): Promise<void>;

  listRosters(): Promise<Roster[]>;
  saveRoster(roster: Roster): Promise<void>;
}