export type SignupUser = {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  tenant: string;
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
  role: string;
  tenant: {
    id: string;
    name: string;
    status: string;
    is_billing_owner: boolean;
    current_period_end?: Date | null;
    cancel_at_period_end?: boolean | null;
    plan: string;
    has_stripe_subscription: boolean;
  };
  status: string;
  avatar?: string;
};

export type InviteUser = {
  email: string;
  role: string;
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

export type Instructor = {
  id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
};

export type UserSort = {
  field: string;
  dir: "asc" | "desc";
};
