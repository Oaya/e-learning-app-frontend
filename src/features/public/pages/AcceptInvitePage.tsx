import { useNavigate, useSearchParams } from "react-router-dom";

import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import type { AcceptInviteUser } from "@/type/user";
import { fdString } from "@/utils/formData";
import AuthLayout from "../components/AuthLayout";

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const { acceptInviteUser, isLoading } = useAuth();
  const alert = useAlert();
  const teacher = searchParams.get("invited_by");
  const navigate = useNavigate();

  const handleCreatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (data.password !== data.password_confirmation) {
        alert.error("Password and Confirm Password has to match");
        return;
      }

      const invitationToken = searchParams.get("invitation_token");

      if (!invitationToken) {
        alert.error("Invalid invitation token");
        return;
      }

      const payload: AcceptInviteUser = {
        password: fdString(formData, "password"),
        password_confirmation: fdString(formData, "password_confirmation"),
        invitation_token: invitationToken,
      };

      const res = await acceptInviteUser(payload);

      if (res.data.message) {
        alert.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      alert.error("Failed to accept invitation. Try again later.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-medium text-gray-800">
          {" "}
          You are invited to Learning with {teacher}
        </h1>
        <p className="mb-6 text-sm text-gray-400">Create password to start</p>

        <form onSubmit={handleCreatePassword} className="space-y-2">
          <div>
            <label className="sm-label">Password</label>
            <input
              name="password"
              type="password"
              required
              className="form-input"
            />
          </div>

          <div className="mb-2">
            <label className="sm-label">Confirm Password</label>
            <input
              name="password_confirmation"
              type="password"
              required
              className="form-input"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="btn-primary mt-4 w-full"
          >
            Create Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
