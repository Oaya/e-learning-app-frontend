import type { SectionWithLessons } from "./section";
import type { Instructor } from "./user";

export type Course = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  category: string;
  level: string;
  thumbnail?: string | null;
  price?: number | null;
  created_by: string;
  instructors?: Instructor[];
  created_at: Date;
};

export type CreateCourse = {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor_ids: string[];
  thumbnail?: File | null;
};

export type AddCoursePrice = {
  id: string;
  price: number;
};

export type CourseOverview = Course & {
  sections: SectionWithLessons[];
};
