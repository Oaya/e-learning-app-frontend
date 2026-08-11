import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import type { SignupUser } from "@/type/user";
import { fdString } from "@/utils/formData";
import AuthLayout from "@/features/public/components/AuthLayout";
import { usePlans } from "@/features/public/hooks/usePlans";

export default function SignupPage() {
  const { signupUser, isLoading } = useAuth();
  const alert = useAlert();
  const navigate = useNavigate();
  const { plans } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = {
        email: fdString(formData, "email"),
        first_name: fdString(formData, "first_name"),
        last_name: fdString(formData, "last_name"),
        password: fdString(formData, "password"),
        password_confirm: fdString(formData, "password_confirm"),
        plan: selectedPlan,
      };

      if (data.password !== data.password_confirm) {
        alert.error("Password and Confirm Password should match");
        return;
      }

      const res = await signupUser(data as SignupUser);

      if (res.success) {
        alert.success(res.data.message as string);
      } else {
        alert.error(res.error || "Signup failed");
      }
    } catch (err) {
      alert.error(err as string);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-medium text-gray-800">
          Create account
        </h1>
        <p className="mb-6 text-sm text-gray-400">Join as a Teacher</p>

        <form onSubmit={handleSignup} className="space-y-2">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sm-label">First name</label>
              <input name="first_name" className="form-input" />
            </div>
            <div>
              <label className="sm-label">Last name</label>
              <input name="last_name" className="form-input" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="sm-label">Email</label>
            <input name="email" type="email" className="form-input" />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sm-label">Password</label>
              <input name="password" className="form-input" />
            </div>
            <div>
              <label className="sm-label">Confirm password</label>
              <input
                name="password_confirm"
                type="password"
                className="form-input"
              />
            </div>
          </div>

          {/* Plan */}
          <div>
            <label className="sm-label mb-2 block">Choose a plan</label>
            <div className="grid grid-cols-2 gap-2">
              {plans?.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative rounded-xl border p-2 text-left capitalize transition-colors ${
                    selectedPlan === plan.name
                      ? "border-theme-purple-50 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {plan.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    $ {plan.price} / Month
                  </p>
                  {plan.name === "pro" && selectedPlan !== plan.name && (
                    <span className="bg-theme-purple-10 text-theme-purple-50 absolute top-2 right-2 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                      Popular
                    </span>
                  )}
                  {selectedPlan === plan.name && (
                    <div className="bg-theme-purple-50 absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full">
                      <span className="text-[9px] text-white">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-4 w-full py-2.5"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-3 text-xs text-gray-400">
          By creating an account you agree to our{" "}
          <button
            onClick={() => navigate("/refund-policy")}
            className="text-theme-purple-50 cursor-pointer hover:underline"
          >
            Refund policy
          </button>
          .
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-theme-purple-50 cursor-pointer hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
