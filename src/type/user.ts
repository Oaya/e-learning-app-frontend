import type { Level } from "../utils/constants";

export const roles = ["admin", "student"] as const;
export type Role = (typeof roles)[number];

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

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  status: string;
  avatar?: string;
  timezone?: string;
  created_at: string;
  learning_languages?: string[];
  subscription?: {
    status: string;
    plan: string;
    price: number;
    current_period_end?: Date | null;
    cancel_at_period_end?: boolean | null;
    has_stripe_subscription: boolean;
  };
};

export type UserWithStatues = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  timezone?: string;
  created_at: string;
  hw_status: string;
  status: string;
  payment_status?: string;
  role: Role;
};

export type InviteUser = {
  email: string;
  level?: Level;
  first_name: string;
  last_name: string;
  learning_languages?: string[];
};

export type AcceptInviteUser = {
  invitation_token: string;
  password: string;
  password_confirmation: string;
};

export type UpdateUser = {
  email: string;
  first_name: string;
  last_name: string;
  timezone: string | null;
  avatar?: File | null;
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
  languages?: string[];
};
