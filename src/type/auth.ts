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
  tenant_id: string;
  tenant_name: string;
  plan: string;
};
