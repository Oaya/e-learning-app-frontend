export const levels = [
  "A1-Beginner",
  "A2-Elementary",
  "B1-Intermediate",
  "B2-Upper Intermediate",
  "C1-Advanced",
  "C2-Proficient",
] as const;

export type Level = (typeof levels)[number];

export type LanguageLevel = {
  language: string;
  level?: Level | ""; // optional — migrated data may not have a level set yet
};

export const roles = ["admin", "student"] as const;
export type Role = (typeof roles)[number];

export const statusValue = ["inactive", "active", "invited"] as const;
export type Status = (typeof statusValue)[number];

export type SignupUser = {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  plan: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type InviteUser = {
  email: string;
  first_name: string;
  last_name: string;
  language_levels?: LanguageLevel[];
};

export type AcceptInviteUser = {
  invitation_token: string;
  password: string;
  password_confirmation: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  status: Status;
  avatar?: string;
  timezone?: string;
  created_at: string;
  language_levels?: LanguageLevel[];
  subscription?: {
    status: string;
    plan: string;
    price: number;
    current_period_end?: Date | null;
    cancel_at_period_end?: boolean | null;
    has_stripe_subscription: boolean;
  };
};

export type StudentWithStatues = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  timezone?: string;
  created_at: string;
  hw_status: string;
  status: Status;
  payment_status?: string;
  role: "student";
};

export type UpdateUser = {
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
  avatar?: File | null;
};

export type UpdateStudentData = {
  first_name: string;
  last_name: string;
  email: string;
  language_levels: LanguageLevel[];
  timezone: string;
  status: Status;
};

export type UpdatePassword = {
  current_password: string;
  new_password: string;
};

export type UserNameAndAvatar = {
  id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
};

export type UserSort = {
  field: string;
  dir: "asc" | "desc";
};

export type UserTableFilter = {
  name: string;
  header: string;
  type: string;
  options: {
    value: string;
    label: string;
  }[];
};

export type StudentOption = {
  value: string;
  label: string;
  avatar?: string | null;
  language_levels?: LanguageLevel[];
};
