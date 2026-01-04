export type Course = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CreateCourse = {
  title: string;
  description: string;
};
