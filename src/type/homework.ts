import type {
  Attachment,
  FeedbackData,
  HomeworkSubmissionStatus,
  ScoreType,
} from "./homework_submission";
import type { LanguageLevel } from "./user";

export type Homework = {
  id: string;
  title: string;
  instructions?: string;
  due_date: string; // ISO date string
  language?: string;
  level: string;
  ai_generated: boolean;
  status: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    language_levels: LanguageLevel[];
  };
  submission?: FeedbackData & {
    id: string;
    status: HomeworkSubmissionStatus;
    answer_text?: string;
    submitted_at?: string;
    reviewed_at?: string;
    attachments?: Attachment[];
    feedback?: {
      score: ScoreType;
      feedback_text: string;
      notes?: string;
    };
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

export type GenerateHomeworkWithAI = {
  student_id: string;
  language: string;
  level: string;
  exercise_type: string;
  topics: string[];
  notes?: string;
};
