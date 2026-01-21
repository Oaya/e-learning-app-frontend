import type { SectionWithLessons } from "./section";
import type { Instructor } from "./user";

export type Course = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  category: string;
  level: string;
  thumbnail_key: string | null;
  thumbnail_url: string | null;
  thumbnail_name: string | null;
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
  thumbnail_name?: string | null;
  thumbnail_key?: string | null; // optional
};

export type AddCoursePrice = {
  id: string;
  price: number;
};

export type CourseOverview = Course & {
  sections: SectionWithLessons[];
};
