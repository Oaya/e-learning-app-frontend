import type { Course } from "./course";

export type Enrollment = {
  id: string;
  enrolled_at: Date;
  started_at?: Date | null;
  completed_at?: Date | null;
  progress?: number; // percentage of course completed
  status?: "enrolled" | "active" | "completed";
  last_accessed_lesson_id?: string | null;
  course: Course;
};

export type UserEnrollmentWithStatus = {
  enrollment: Enrollment;

  // status: "active" | "completed" | "dropped" | "not_enrolled";
  // progress?: number; // percentage of course completed
  // //Each section and lesson of status
  // // sections: {
  // //   id: string;
  // //   title: string;
  // //   status: "active" | "completed" | "not_started";
  // //   progress?: number; // percentage of section completed
  // //   lessons: {
  // //     id: string;
  // //     title: string;
  // //     status: "active" | "completed" | "not_started";
  // //     progress?: number; // percentage of lesson completed
  // //   }[];
  // }[];
};
