import { useAlert } from "../../../contexts/AlertContext";
import { useAuth } from "../../../contexts/AuthContext";
import type { SignupUser } from "../../../type/user";
import CustomSelect from "../../../ui/CustomSelect";
import { capitalize } from "../../../utils/helper";
import { fdString } from "../../../utils/formData";

const PLANS = ["free", "pro"];

export default function SignupPage() {
  const { signupUser, isLoading } = useAuth();
  const alert = useAlert();

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
        plan: fdString(formData, "plan"),
      };

      //Check the password and password_confirm is same or not
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
      return;
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

        <div className="mb-2">
          <label className="block text-lg">Password</label>
          <input name="password" type="password" className="form-input" />
        </div>
        <div className="mb-2">
          <label className="block text-lg">Confirm Password</label>
          <input
            name="password_confirm"
            type="password"
            className="form-input"
          />
        </div>

        <div className="mb-2">
          <label className="block text-lg">Plan</label>
          <CustomSelect
            name="plan"
            options={(PLANS ?? []).map((p) => ({
              value: p,
              label: capitalize(p),
            }))}
          ></CustomSelect>
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
