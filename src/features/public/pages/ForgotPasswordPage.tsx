import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";

import { useAlert } from "@/contexts/AlertContext";
import { forgotPassword } from "@/api/auth";
import AuthLayout from "@/features/public/components/AuthLayout";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      alert.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      if (res.success) {
        setSubmitted(true);
      } else {
        alert.error(res.error || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        {!submitted ? (
          <>
            {/* Back link */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
            >
              <HiOutlineArrowLeft size={15} />
              Back to sign in
            </button>

            <h1 className="mb-1 text-xl font-medium text-gray-800">
              Forgot password?
            </h1>
            <p className="mb-6 text-sm text-gray-400">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sm-label">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success state */}

            <h1 className="mb-4 text-xl font-medium text-gray-800">
              Check your email
            </h1>
            <p className="mb-3 text-sm text-gray-400">
              We sent a password reset link to:
            </p>

            <div className="mb-5 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-gray-700">
              {email}
            </div>

            <p className="mb-6 text-sm text-gray-400">
              Click the link in the email to set a new password. The link
              expires in 30 minutes.
            </p>

            <p className="text-xs text-gray-400">
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-theme-purple-50 hover:underline"
              >
                Try again
              </button>{" "}
              ·{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-theme-purple-50 hover:underline"
              >
                Back to sign in
              </button>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
