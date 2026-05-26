import type { Course } from "./course";

export type EnrollmentStatus = "enrolled" | "active" | "completed";
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type Enrollment = {
  id: string;
  enrolled_at: Date;
  started_at?: Date | null;
  completed_at?: Date | null;
  progress?: number; // percentage of course completed
  status?: EnrollmentStatus;
  last_accessed_lesson_id?: string | null;
  course: Course;
};

export type UserEnrollmentWithStatus = {
  enrollment: Enrollment;
  progress_percentage: number;
  total_lessons: number;
  lesson_progresses?: {
    id: string;
    lesson_id: string;
    status: LessonProgressStatus;
    progress: number;
    watched_seconds: number;
  }[];
};
