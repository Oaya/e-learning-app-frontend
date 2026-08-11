import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAlert } from "@/contexts/AlertContext";
import { resetPassword } from "@/api/auth";
import AuthLayout from "@/features/public/components/AuthLayout";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const alert = useAlert();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("reset_password_token") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get(
      "password_confirmation",
    ) as string;

    if (!token) {
      alert.error(
        "Reset link is invalid or has expired. Please request a new one.",
      );
      return;
    }

    if (password !== passwordConfirmation) {
      alert.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      alert.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (res.success) {
        setDone(true);
      } else {
        alert.error(
          res.error || "Reset link may have expired. Please request a new one.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        {!done ? (
          <>
            <h1 className="mb-1 text-xl font-medium text-gray-800">
              Set new password
            </h1>
            <p className="mb-6 text-sm text-gray-400">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sm-label">New password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div>
                <label className="sm-label">Confirm new password</label>
                <input
                  name="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="btn-primary w-full py-2.5"
              >
                {isLoading ? "Updating..." : "Update password"}
              </button>

              {!token && (
                <p className="text-center text-xs text-red-500">
                  This link is invalid or expired.{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="underline"
                  >
                    Request a new one
                  </button>
                </p>
              )}
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-xl font-medium text-gray-800">
              Password updated
            </h1>
            <p className="mb-6 text-sm text-gray-400">
              Your password has been changed. You can now sign in with your new
              password.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-primary w-full py-2.5"
            >
              Go to sign in
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
