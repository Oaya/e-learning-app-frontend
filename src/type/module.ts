export type Module = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CreateModule = {
  course_id?: string;
  title: string;
  description: string;
};
