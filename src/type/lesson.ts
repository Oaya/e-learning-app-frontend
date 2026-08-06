export type LessonStatusType =
  | "scheduled"
  | "canceled"
  | "completed"
  | "no_show";

export type PaymentStatusType = "paid" | "unpaid";

export type UpsertLesson = {
  student_id: string;
  language: string;
  topic: string;
  duration_in_minutes: number;
  scheduled_at: Date;
  teacher_note?: string;
  status: LessonStatusType;
};

export type UpsertLessonMeeting = {
  meeting_duration_in_seconds?: number;
  status: LessonStatusType;
  meeting_feedback?: string;
};

export type Lesson = {
  id: string;
  scheduled_at: string;
  duration_in_minutes: number;
  topic: string;
  teacher_note: string | null;
  language: string;
  status: LessonStatusType;
  payment_status: PaymentStatusType;
  meeting_duration_in_seconds?: number;
  meeting_feedback?: string;
  recording_url?: string;
  student_note?: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    learning_languages: string[];
  };
};
