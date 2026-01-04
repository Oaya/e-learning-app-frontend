import { useState } from "react";
import type { LoginUser } from "../../type/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await loginUser(data as LoginUser);
      if (res.success) {
        setMessage(res.data.message as string);
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      setError(err as string);
    }
  };

  const ClearState = () => {
    setError(null);
    setMessage(null);
  };

  return (
    <div className="m-10 mx-auto w-150 text-2xl">
      <div>{error && <p>{error}</p>}</div>
      <div>{message && <p>{message}</p>}</div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label className="block text-lg font-bold">Email</label>
          <input
            name="email"
            onChange={ClearState}
            className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
          />
        </div>

        <div className="mb-2">
          <label className="block text-lg font-bold">Password</label>
          <input
            name="password"
            type="password"
            onChange={ClearState}
            className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
          />
        </div>

        <button
          type="submit"
          className="bg-c-pink my-2 w-full rounded px-6 py-3 text-center text-white"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
