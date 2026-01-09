import type { SectionWithLessons } from "./section";

export type Course = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  category: string;
  level: string;
  created_at: Date;
  updated_at: Date;
};

export type CreateCourse = {
  title: string;
  description: string;
  category: string;
  level: string;
};

export type CourseOverview = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  sections: SectionWithLessons[];
};
