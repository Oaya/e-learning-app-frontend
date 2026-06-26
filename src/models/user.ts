import type { User } from "../type/user";

export class UserModel {
  private user: User | null | undefined;

  constructor(user: User | null | undefined) {
    this.user = user;
  }

  isAdmin() {
    return this.user?.role === "admin";
  }
  isStudent() {
    return this.user?.role === "student";
  }
  fullName() {
    return `${this.user?.first_name ?? ""} ${this.user?.last_name ?? ""}`.trim();
  }
}
