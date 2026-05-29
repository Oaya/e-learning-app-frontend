import { Link } from "react-router-dom";

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold">
        Cancellation &amp; Refund Policy
      </h1>
      <p className="mb-10 text-sm text-gray-400">Last updated: May 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Cancellations</h2>
        <p className="text-gray-600">
          You may cancel your monthly subscription at any time. To cancel,
          please log into your account and update your billing preferences. Your
          access will remain active until your current paid month concludes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Refunds</h2>
        <p className="text-gray-600">
          We do not provide prorated refunds or credits for any partial-month
          subscription periods or unwatched course content.
        </p>
      </section>

      <p className="mt-12 text-sm text-gray-400">
        Questions?{" "}
        <Link
          to="/"
          className="text-purple-600 underline hover:text-purple-800"
        >
          Contact us
        </Link>
      </p>
    </div>
  );
}
