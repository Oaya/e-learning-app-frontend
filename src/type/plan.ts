export type Plan = {
  id: string;
  name: string;
  price: number;
  features: {
    max_users: number;
    max_courses: number;
    quizzes: boolean;
  };
  stripe_price_id?: string;
};
