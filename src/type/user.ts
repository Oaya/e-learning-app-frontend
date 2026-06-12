import type { Level, Role } from "../utils/constants";

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
  subscription?: {
    status: string;
    plan: string;
    current_period_end?: Date | null;
    cancel_at_period_end?: boolean | null;
    has_stripe_subscription: boolean;
  };
};

export type InviteUser = {
  email: string;
  level?: Level;
  first_name: string;
  last_name: string;
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
