import { useNavigate } from "react-router-dom";

import type { LoginUser } from "../../type/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await loginUser(data as LoginUser);
      if (res.success) {
        alert.success(res.data.message || "Login successful");
        navigate("/admin", { replace: true });
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
          className="bg-dark-purple my-2 w-full rounded px-6 py-2 text-center text-lg text-white"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
