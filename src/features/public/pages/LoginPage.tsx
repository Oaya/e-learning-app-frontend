import { useNavigate } from "react-router-dom";

import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginUser } from "@/type/user";
import AuthLayout from "@/features/public/components/AuthLayout";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { loginUser, isLoading } = useAuth();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (!data.email || !data.password) {
        alert.error("Email and password are required");
        return;
      }

      const res = await loginUser(data as LoginUser);

      if (res.success) {
        alert.success(res.data.message || "Login successful");
        if (res.data.user.role === "student") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        alert.error(res.error || "Login failed");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert.error(err as string);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-medium text-gray-800">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-400">Sign in to continue</p>
        {/* Google button */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-center gap-2.5 rounded border border-gray-200 bg-white py-3 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="sm-label">Email</label>
            <input name="email" type="email" className="form-input" />
          </div>
          <div>
            <label className="sm-label">Password</label>
            <input name="password" type="password" className="form-input" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-4 w-full py-2.5"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-3 text-xs text-gray-400">
          No account yet?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-theme-purple-50 cursor-pointer hover:underline"
          >
            Create account
          </button>
        </p>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-theme-purple-50 text-xs hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </AuthLayout>
  );
}
