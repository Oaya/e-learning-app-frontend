import type { User } from "../type/user";
import { capitalize } from "../utils/helper";

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
  isInstructor() {
    return this.user?.role === "instructor";
  }
  isAdminOrInstructor() {
    return this.isAdmin() || this.isInstructor();
  }
  isBillingOwner() {
    return this.user?.tenant.is_billing_owner ?? false;
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
