import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { capitalize } from "../../../../utils/helper";
import CustomSelect from "../../../../ui/CustomSelect";

type UpdateSubscriptionProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  mode?: "Update" | "Reactivate";
};

type PlanOption = {
  value: string;
  label: string;
};

const PLAN_OPTIONS: PlanOption[] = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
];

export default function UpdateSubscriptionModal({
  isOpen,
  onClose,
  plan,
  mode,
}: UpdateSubscriptionProps) {
  const alert = useAlert();
  const { changeTenantPlan, isLoading } = useAuth();
  const navigation = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleChangePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const new_plan = selectedPlan?.value;

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

      const res = await changeTenantPlan(new_plan);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">{mode} Plan</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        <p>
          {mode === "Reactivate"
            ? "You are about to reactivate your plan."
            : "Please select your new plan from the options below."}
        </p>
        <form onSubmit={handleChangePlan} className="my-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mb-2">
              <div className="sm-label">Current Plan</div>
              <div className="read-only-input">{capitalize(plan ?? "-")}</div>
            </div>

            <div className="mb-2">
              <label className="sm-label block"> New Plan</label>
              <CustomSelect
                name="new_plan"
                className="form-select"
                required
                value={selectedPlan}
                onChange={(opt: PlanOption | null) => setSelectedPlan(opt)}
                options={PLAN_OPTIONS}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              className="btn-primary-pink"
              disabled={isLoading}
            >
              {isLoading ? `${mode}ing Plan...` : `${mode} Plan`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
