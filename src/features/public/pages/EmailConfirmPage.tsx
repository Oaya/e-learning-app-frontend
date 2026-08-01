import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";

export default function EmailConfirmPage() {
  const [searchParams] = useSearchParams();
  const alert = useAlert();

  const navigate = useNavigate();
  const status = searchParams.get("status");

  useEffect(() => {
    let navTo = "/signup";
    if (status !== "success") {
      alert.error(
        "There was an error confirming your email. Please try again.",
      );
      return;
    } else {
      alert.success(
        "Your email has been successfully confirmed. You can now log in.",
      );
      navTo = "/login";
    }

    setTimeout(() => {
      navigate(navTo, { replace: true });
    }, 1500);
  }, [status, navigate, alert]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Email Confirmation
        </h1>

        {status === "success" && (
          <p className="text-center text-2xl text-green-600">
            <br />
            <span className="mt-2 block text-base text-gray-600">
              Redirecting you shortly...
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
