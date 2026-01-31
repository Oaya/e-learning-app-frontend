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

export type UpsertLesson = {
  section_id?: string;
  title: string;
  description?: string;
  lesson_type: string;
  video?: File | null;
  video_signed_id?: string;
  removed?: boolean;
  duration_in_seconds?: number | null;
  article?: string;
};

export type ReorderLessons = {
  section_id: string;
  lesson_ids: string[];
};
