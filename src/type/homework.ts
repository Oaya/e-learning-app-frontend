export type HomeworkStatus = "pending" | "submitted" | "overdue" | "reviewed";

export type Homework = {
  id: string;
  title: string;
  instructions?: string;
  due_date: string; // ISO date string
  submitted_at?: string;
  reviewed_at?: string;
  status: HomeworkStatus;
  language?: string;
  level?: string;
  ai_generated: boolean;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    learning_languages: string[];
  };
};

export type UpsertHomework = {
  student_id: string;
  title: string;
  instructions: string;
  due_date: string;
  language: string;
  level: string;
  ai_generated: boolean;
};

export type HomeworkSubmission = {
  id: string;
  homework: Homework;
  submission_text?: string;
  attachment: {
    name: string;
    size: string;
    type: string;
  };
  ai_suggestion?: string;
};
