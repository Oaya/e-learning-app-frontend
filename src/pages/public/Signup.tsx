import { useState } from "react";
import type { SignupUser } from "../../type/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupPage() {
  const { signupUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    //Check the password and confirm_password is same or not
    if (data.password === data.password_confirm) {
      setError("Password and Confirm Password should match");
    }

    try {
      const res = await signupUser(data as SignupUser);
      if (res.data.message) {
        setMessage(res.data.message as string);
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
      <h2>Sign up</h2>
      <form onSubmit={handleSignup}>
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
        <div className="mb-2">
          <label className="block text-lg font-bold">Confirm Password</label>
          <input
            name="password_confirmation"
            type="password"
            onChange={ClearState}
            className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
          />
        </div>
        <div className="flex gap-4">
          <div className="mb-2">
            <label className="block text-lg font-bold">First Name</label>
            <input
              name="first_name"
              onChange={ClearState}
              className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-lg font-bold">Last Name</label>
            <input
              name="last_name"
              onChange={ClearState}
              className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mb-2">
            <label className="block text-lg font-bold">Tenant Name</label>
            <input
              name="tenant"
              onChange={ClearState}
              className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-lg font-bold">Plan</label>
            <select
              name="plan"
              className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-3 shadow-md"
            >
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-pink my-2 w-full rounded px-6 py-3 text-center text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
