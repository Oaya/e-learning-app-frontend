export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PaymentStatus = "paid" | "unpaid";

export type Session = {
  id: string;
  student_id: string;
  student_name: string;
  student_initials: string;
  student_color: "green" | "blue" | "amber" | "pink" | "purple";
  scheduled_at: string;       // ISO datetime string
  duration_in_minutes: number;
  status: SessionStatus;
  topic: string;
  notes?: string;
  payment_status: PaymentStatus;
  has_recording?: boolean;
};
