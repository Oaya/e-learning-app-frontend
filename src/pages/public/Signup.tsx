import { useState } from "react";

import type { SignupUser } from "../../type/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupPage() {
  const { signupUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearState();
    setIsSubmitting(true);

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
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err as string);
      setIsSubmitting(false);
    }
  };

  const clearState = () => {
    setError(null);
    setMessage(null);
  };

  return (
    <div className="m-10 mx-auto w-150 text-2xl">
      <div>{error && <p>{error}</p>}</div>
      <div>{message && <p>{message}</p>}</div>
      <h2 className="mb-2 text-center">Sign up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-2">
          <label className="block text-lg">Email</label>
          <input name="email" onChange={clearState} className="form-input" />
        </div>

        <div className="mb-2">
          <label className="block text-lg">Password</label>
          <input
            name="password"
            type="password"
            onChange={clearState}
            className="form-input"
          />
        </div>
        <div className="mb-2">
          <label className="block text-lg">Confirm Password</label>
          <input
            name="password_confirmation"
            type="password"
            onChange={clearState}
            className="form-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-lg">First Name</label>
            <input
              name="first_name"
              onChange={clearState}
              className="form-input"
            />
          </div>
          <div className="mb-2">
            <label className="block text-lg">Last Name</label>
            <input
              name="last_name"
              onChange={clearState}
              className="form-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-lg">Tenant Name</label>
            <input name="tenant" onChange={clearState} className="form-input" />
          </div>
          <div className="mb-2">
            <label className="block text-lg">Plan</label>
            <select
              name="plan"
              className="mb-2 w-full rounded border border-gray-300 bg-white px-6 py-2.5 text-lg shadow-md"
            >
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-dark-purple my-2 w-full rounded px-6 py-2 text-center text-lg text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
