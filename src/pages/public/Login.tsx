import { useNavigate } from "react-router-dom";

import type { LoginUser } from "../../type/user";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

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
      if (res.success) {
        alert.success(res.data.message || "Login successful");
        navigate("/admin", { replace: true });
      } else {
        alert.error(res.error || "Login failed");
      }
    } catch (err) {
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
