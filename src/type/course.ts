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
  modules: {
    id: string;
    title: string;
    position: number;
    description: string;
    lessons?: {
      id: string;
      title: string;
      description: string;
      lesson_type: string;
      position: number;
    }[];
  }[];
};
