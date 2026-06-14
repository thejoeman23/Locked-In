import { Exam, Roster } from './exam-layout';
import { TeacherStorage } from "./teacher-storage";

export const localTeacherStorage: TeacherStorage = {
  async listExams() {
    return JSON.parse(localStorage.getItem("teacher:exams") ?? "[]");
  },

  async saveExam(exam: Exam) {
    const exams = await this.listExams();
    const next = exams.filter((item) => item.id !== exam.id).concat(exam);
    localStorage.setItem("teacher:exams", JSON.stringify(next));
  },

  async getExam(id: string) {
    const exams = await this.listExams();
    return exams.find((item) => item.id === id) ?? null;
  },

  async deleteExam(id: string) {
    const exams = await this.listExams();
    const next = exams.filter((item) => item.id !== id);
    localStorage.setItem("teacher:exams", JSON.stringify(next));
  },


  async listRosters() {
    return JSON.parse(localStorage.getItem("teacher:rosters") ?? "[]");
  },

  async saveRoster(roster: Roster) {
    const rosters = await this.listRosters();
    const next = rosters.filter((item) => item.id !== roster.id).concat(roster);
    localStorage.setItem("teacher:rosters", JSON.stringify(next));
  }
};
