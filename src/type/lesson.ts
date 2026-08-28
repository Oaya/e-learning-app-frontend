import type { InvoiceStatusType } from "./invoice";
import type { LanguageLevel } from "./user";

export type LessonStatusType =
  | "scheduled"
  | "canceled"
  | "completed"
  | "no_show";

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
  note_shared?: boolean;
};

export type Lesson = {
  id: string;
  scheduled_at: string;
  duration_in_minutes: number;
  topic: string;
  teacher_note: string | null;
  language: string;
  status: LessonStatusType;
  invoice_status?: InvoiceStatusType | null;
  cancellation_fee_amount?: number | null;
  meeting_duration_in_seconds?: number;
  meeting_feedback?: string;
  meeting_note?: string | null;
  note_shared?: boolean;
  recording_url?: string;
  student_note?: string;
  invoice_id?: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    language_levels: LanguageLevel[];
    lesson_rate: number;
  };
  admin: {
    first_name: string;
    last_name: string;
    email: string;
    no_show_fee_percent: number;
    late_cancellation_fee_percent: number;
    cancellation_window_hours: number;
    currency: string;
  };
};
