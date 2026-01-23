import type { SignupUser } from "../../type/user";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

export default function SignupPage() {
  const { signupUser, isLoading } = useAuth();
  const alert = useAlert();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      //Check the password and confirm_password is same or not
      if (data.password !== data.password_confirmation) {
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
    <div className="m-10 mx-auto w-150 text-2xl">
      <h2 className="mb-2 text-center">Sign up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-2">
          <label className="block text-lg">Email</label>
          <input name="email" className="form-input" />
        </div>

        <div className="mb-2">
          <label className="block text-lg">Password</label>
          <input name="password" type="password" className="form-input" />
        </div>
        <div className="mb-2">
          <label className="block text-lg">Confirm Password</label>
          <input
            name="password_confirmation"
            type="password"
            className="form-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-lg">First Name</label>
            <input name="first_name" className="form-input" />
          </div>
          <div className="mb-2">
            <label className="block text-lg">Last Name</label>
            <input name="last_name" className="form-input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-lg">Tenant Name</label>
            <input name="tenant" className="form-input" />
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
          disabled={isLoading}
          className="btn-primary w-full text-lg"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
