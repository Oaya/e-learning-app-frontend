import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import type { AcceptInviteUser } from "../../type/user";
import { useAlert } from "../../contexts/AlertContext";
import { fdString } from "../../utils/formData";

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const { acceptInviteUser, isLoading } = useAuth();
  const alert = useAlert();
  const tenantName = searchParams.get("tenant");
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
    <div className="m-10 mx-auto w-150 text-2xl">
      <h2 className="pb-4 text-center text-5xl">
        You are invited to {tenantName}
      </h2>

      <form onSubmit={handleCreatePassword}>
        <div className="mb-2">
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
  );
}
