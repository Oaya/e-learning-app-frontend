import { useNavigate } from "react-router-dom";
import { TbAlertTriangle, TbCreditCard, TbRefresh } from "react-icons/tb";

export default function SubscriptionBanner({
  hasStripeSubscription,
  status,
}: {
  hasStripeSubscription: boolean;
  status: string;
}) {
  const navigate = useNavigate();
  const isPending = !hasStripeSubscription && status !== "active";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-amber-200 bg-amber-50 px-8 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200">
          <TbAlertTriangle size={15} className="text-theme-yellow-20" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800">
            {isPending
              ? "Your subscription is pending payment"
              : "Your subscription needs attention"}
          </p>
          <p className="text-theme-yellow-20 text-xs">
            {isPending
              ? "Complete checkout to activate your plan and unlock all features."
              : "Reactivate your subscription to keep access to all features."}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(isPending ? "/payment" : "/profile")}
        className="btn-secondary gap-1.5"
      >
        {isPending ? (
          <>
            <TbCreditCard size={16} />
            Complete payment
          </>
        ) : (
          <>
            <TbRefresh size={16} />
            Reactivate
          </>
        )}
      </button>
    </div>
  );
}
