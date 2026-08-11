import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePlans } from "@/features/public/hooks/usePlans";
import { capitalize } from "@/utils/helper";
import ModalShell from "@/ui/ModalShell";

type UpdateSubscriptionProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  mode?: "Update" | "Reactivate";
};

export default function UpdateSubscriptionModal({
  isOpen,
  onClose,
  plan,
  mode,
}: UpdateSubscriptionProps) {
  const alert = useAlert();
  const { changeSubscriptionPlan, isLoading } = useAuth();
  const { plans } = usePlans();
  const navigation = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(plan);

  if (!isOpen) {
    return null;
  }

  const handleChangePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const new_plan = selectedPlan;

      if (!new_plan) {
        alert.error("Please select a plan.");
        return;
      }

      if (mode === "Update" && plan === new_plan) {
        alert.error(
          "You are already on this plan. Please select a different plan.",
        );
        return;
      }

      const res = await changeSubscriptionPlan(new_plan);

      if (res.success) {
        if (res.data.redirect_to_checkout) {
          console.log("Redirecting to payment page with plan:", new_plan); // Debug log for plan
          navigation("/payment", { state: { plan: new_plan } });
        } else {
          alert.success(res.data.message);
        }

        onClose();
      } else {
        alert.error(res.error || "Failed to change plan. Try again later.");
      }
    } catch (err) {
      alert.error("Failed to change plan. Try again later.");
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={`${mode} Plan`}>
      <form onSubmit={handleChangePlan} className="modal-body">
        <div>
          <p>
            {mode === "Reactivate"
              ? "You are about to reactivate your plan."
              : "Please select your new plan from the options below."}
          </p>
          <p className="text-gray-500">Changes take effect immediately</p>

          <div className="bg-theme-purple-30 text-theme-purple-50 my-3 inline-flex w-fit items-center justify-center gap-1 rounded-full px-2 py-0.5 text-sm">
            <BsStars />
            <p> Currently on {capitalize(plan)}</p>
          </div>
        </div>

        {/* Plan */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            {plans?.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative rounded-xl border p-2 text-left capitalize transition-colors ${
                  selectedPlan === plan.name
                    ? "border-theme-purple-50 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-lg font-semibold text-gray-800">
                  {plan.name}
                </p>
                <p className="text-2xl font-semibold">
                  $ {plan.price}
                  <span className="text-xs text-gray-400"> / Month</span>
                </p>
                {plan.name === "pro" && selectedPlan !== plan.name && (
                  <span className="bg-theme-purple-10 text-theme-purple-50 absolute top-2 right-2 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                    Popular
                  </span>
                )}
                {selectedPlan === plan.name && (
                  <div className="bg-theme-purple-50 absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full">
                    <span className="text-[9px] text-white">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="btn-primary-pink"
            disabled={isLoading}
          >
            {isLoading ? `${mode}ing Plan...` : `${mode} Plan`}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
