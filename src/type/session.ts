export type CreateSession = {
  student_id: string;
  topic: string;
  duration_in_minutes: number;
  scheduled_at: Date;
};
