export interface StudentStorageState {
  examCode: string;
  studentName: string;
}

export interface StudentStorage {
  getStudent(): Promise<StudentStorageState | null>;
  saveStudent(student: StudentStorageState): Promise<void>;
  clearStudent(): Promise<void>;
}
