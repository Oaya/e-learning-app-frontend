export type Lesson = {
  id: string;
  title: string;
  description?: string;
  lesson_type?: string;
  content_url?: string;
  position: number;
  created_at: Date;
  updated_at: Date;
};

export type CreateLesson = {
  section_id?: string;
  title: string;
  description?: string;
  lesson_type?: string;
  content_url?: string;
};

export type UpdateLesson = {
  id: string;
  title: string;
  description?: string;
  lesson_type?: string;
  content_url?: string;
};
