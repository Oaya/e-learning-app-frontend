export type Plan = {
  id: string;
  name: string;
  price: number;
  features: {
    max_students: string | number;
    lesson_schedule: boolean;
    homework_assignments: boolean;
    payment_tracking: boolean;
    lesson_recording: boolean;
    student_goals: boolean;
    ai_homework_generation: boolean;
  };
  stripe_price_id?: string;
};
