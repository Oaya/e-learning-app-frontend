export type CreateSession = {
  student_id: string;
  topic: string;
  duration_in_minutes: number;
  scheduled_at: Date;
};
export type SessionStatus = "done" | "scheduled" | "cancelled" | "completed";

export type Session = {
  id: string;
  scheduled_at: string;
  duration_in_minutes: number;
  topic: string;
  note: string | null;
  status: SessionStatus;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
};
