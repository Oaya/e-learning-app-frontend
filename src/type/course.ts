import type { SectionWithLessons } from "./section";

export type Course = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  category: string;
  level: string;
  thumbnail_key: string | null;
  thumbnail_url: string | null;
  course_currency: string | null;
  course_price: number | null;
  created_by: string;
  instructor: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: Date;
};

export type CreateCourse = {
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: File | null;
  thumbnail_key?: string | null; // optional
};

export type AddCoursePrice = {
  id: string;
  price: number;
};

export type CourseOverview = Course & {
  sections: SectionWithLessons[];
};
