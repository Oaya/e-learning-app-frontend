import type { Lesson } from "./lesson";

export type Section = {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type CreateSection = {
  course_id?: string;
  title: string;
  description: string;
};

export type UpdateSection = {
  id: string;
  title: string;
  description: string;
};

export type SectionWithLessons = {
  id: string;
  title: string;
  position: number;
  description: string;
  lessons?: Lesson[];
};

export type ReorderSections = {
  course_id: string;
  section_ids: string[];
};
