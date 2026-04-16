import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";
import { useAuth } from "../../../contexts/AuthContext";
import type { LoginUser } from "../../../type/user";

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

      const res = await loginUser(data as LoginUser);
      console.log("Login result:", res); // Debug log for tenant status
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
    <div className="m-10 mx-auto w-150 text-2xl">
      <h2 className="mb-2 text-center">Log in</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label className="block text-lg">Email</label>
          <input name="email" className="form-input" />
        </div>

        <div className="mb-2">
          <label className="block text-lg">Password</label>
          <input name="password" type="password" className="form-input" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full text-lg"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
