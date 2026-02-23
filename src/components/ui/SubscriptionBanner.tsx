import { NavLink } from "react-router-dom";

export default function SubscriptionBanner({
  isBillingOwner,
  hasStripeSubscription,
}: {
  isBillingOwner: boolean;
  hasStripeSubscription: boolean;
}) {
  let message = "";
  let messageType: "payment" | "reactivate" | "contact_admin" = "payment";

  if (!isBillingOwner) {
    messageType = "contact_admin";
    message =
      "Your organization does not have an active subscription. Please contact your administrator.";
  } else if (!hasStripeSubscription) {
    messageType = "payment";
    message =
      "Your subscription is inactive. Please complete your subscription payment.";
  } else {
    messageType = "reactivate";
    message =
      "You need to reactivate your subscription. Please update your payment information.";
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="bg-theme-green-10">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between lg:flex-row lg:justify-center">
            <div className="flex flex-1 items-center lg:mr-3 lg:flex-none">
              <p className="ml-3 text-center font-medium text-white">
                {message}
              </p>
            </div>

            {isBillingOwner && (
              <div className="mt-2 w-full shrink-0 lg:mt-0 lg:w-auto">
                <NavLink
                  to={messageType === "payment" ? "/payment" : "/profile"}
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-teal-600 shadow-sm hover:bg-teal-50"
                >
                  {messageType === "payment" ? "Pay Now" : "Reactivate"}
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
