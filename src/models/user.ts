import type { User, AdminUser } from "../type/user";
import { capitalize } from "../utils/helper";

export class UserModel {
  private user: User | null | undefined;

  constructor(user: User | AdminUser | null | undefined) {
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
  displayRole() {
    const role = this.user?.role;
    if (!role) return "-";
    return capitalize(role);
  }
}
