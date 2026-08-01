import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";
import { useAuth } from "../../../contexts/AuthContext";
import type { SignupUser } from "../../../type/user";
import { fdString } from "../../../utils/formData";
import AuthCard from "../components/AuthCard";
import { usePlans } from "../hooks/usePlans";

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
    <AuthCard className="py-10">
      <h1 className="mb-1 text-center text-lg font-semibold text-gray-800">
        Create your account
      </h1>
      <p className="mb-7 text-center text-sm text-gray-400">
        Start managing your students today
      </p>

      <form onSubmit={handleSignup} className="space-y-2">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="sm-label">First name</label>
            <input name="first_name" placeholder="Aya" className="form-input" />
          </div>
          <div>
            <label className="sm-label">Last name</label>
            <input
              name="last_name"
              placeholder="Smith"
              className="form-input"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="sm-label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="form-input"
          />
        </div>

        {/* Password row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="sm-label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="form-input"
            />
          </div>
          <div>
            <label className="sm-label">Confirm password</label>
            <input
              name="password_confirm"
              type="password"
              placeholder="••••••••"
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
                <p className="text-xs text-gray-400">$ {plan.price} / month</p>
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
          className="btn-primary mt-2 w-full py-2.5"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-theme-purple-50 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </AuthCard>
  );
}
