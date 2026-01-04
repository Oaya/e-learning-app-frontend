import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function EmailConfirmPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const status = searchParams.get("status");
  const message =
    status === "success" ? "Your email has been successfully confirmed." : null;
  const error =
    status === "error"
      ? "There was an error confirming your email. Please try again."
      : null;

  useEffect(() => {
    if (status !== "success") return;

    setTimeout(() => {
      navigate("/login");
    }, 5000);
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-6 text-center text-4xl font-bold">
          Email Confirmation
        </h1>

        {error && <p className="text-center text-2xl text-red-600">{error}</p>}

        {message && (
          <p className="text-center text-2xl text-green-600">
            {message}
            <br />
            <span className="mt-2 block text-base text-gray-600">
              Redirecting you to login shortly...
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
