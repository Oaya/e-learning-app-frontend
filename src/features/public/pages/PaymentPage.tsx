import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { startCheckout } from "@/api/subscription";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const alert = useAlert();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const plan = location.state?.plan || user?.subscription?.plan;

  useEffect(() => {
    if (!user || !user.subscription) {
      alert.error(
        "You do not have access to this page. Please contact your administrator.",
      );
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    let cancelled = false;

    async function startPaymentCheckout() {
      try {
        setLoading(true);

        const res = await startCheckout(plan);
        const secret = res.data.client_secret;

        if (!secret) {
          alert.error("Failed to start checkout. Please try again.");
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (!cancelled) setClientSecret(secret);
      } catch (err: any) {
        alert.error("Failed to start checkout. Please try again.");
        navigate("/admin/dashboard", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    startPaymentCheckout();

    return () => {
      cancelled = true;
    };
  }, [user, navigate, alert, plan]);

  if (loading) {
    return (
      <div className="px-4 py-10 text-center text-2xl sm:px-6">
        Starting checkout…
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="px-4 py-10 text-center text-2xl sm:px-6">
        Missing checkout lesson. Please go back to the home.
        <div className="mt-4">
          <button
            className="btn-primary"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-10 text-2xl sm:px-6 lg:px-10 xl:w-225">
      <h2 className="pb-4 text-center text-4xl">Checkout</h2>

      <div className="rounded bg-white p-4 shadow sm:p-6">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        By subscribing you agree to our{" "}
        <Link to="/refund-policy" className="underline hover:text-gray-700">
          Cancellation & Refund Policy
        </Link>
        .
      </p>
    </div>
  );
}
