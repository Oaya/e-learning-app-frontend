import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";
import { useAuth } from "../../../contexts/AuthContext";
import type { LoginUser } from "../../../type/user";
import AuthCard from "../components/AuthCard";

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
    <AuthCard className="py-23">
      <h1 className="mb-1 text-center text-lg font-semibold text-gray-800">
        Welcome back
      </h1>
      <p className="mb-7 text-center text-sm text-gray-400">
        Sign in to continue
      </p>

      <form onSubmit={handleLogin} className="space-y-2">
        <div>
          <label className="sm-label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="form-input"
          />
        </div>

        <div>
          <label className="sm-label">password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2.5"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        No account?{"   "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-theme-purple-50 cursor-pointer"
        >
          create your account
        </button>
      </p>
    </AuthCard>
  );
}
