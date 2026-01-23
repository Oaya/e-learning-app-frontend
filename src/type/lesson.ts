export type Lesson = {
  id: string;
  title: string;
  description?: string;
  lesson_type?: string;
  video?: string | null;
  position: number;
  duration_in_seconds?: number | null;
  article?: string;
};

export type CreateLesson = {
  section_id?: string;
  title: string;
  description?: string;
  lesson_type: string;
  video?: File | null;
  removed?: boolean;
  duration_in_seconds?: number | null;
  article?: string;
};

export type UpdateLesson = CreateLesson & {
  id: string;
  new_file?: File | null;
  existing_key?: string | null;
};

export type ReorderLessons = {
  section_id: string;
  lesson_ids: string[];
};
