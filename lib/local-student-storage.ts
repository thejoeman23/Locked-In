import { StudentStorage } from "./student-storage";

const STUDENT_STORAGE_KEY = "student:last-exam";

export const localStudentStorage: StudentStorage = {
  async getStudent() {
    const savedStudent = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (!savedStudent) {
      return null;
    }

    try {
      return JSON.parse(savedStudent);
    } catch {
      localStorage.removeItem(STUDENT_STORAGE_KEY);
      return null;
    }
  },

  async saveStudent(student) {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
  },

  async clearStudent() {
    localStorage.removeItem(STUDENT_STORAGE_KEY);
  }
};
