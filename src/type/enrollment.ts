import type { Course } from "./course";

export type Enrollment = {
  id: string;
  enrolled_at: Date;
  started_at?: Date | null;
  completed_at?: Date | null;
  progress?: number; // percentage of course completed
  status?: "active" | "completed" | "dropped";
  course: Course;
};
