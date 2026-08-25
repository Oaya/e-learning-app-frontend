import { useState } from "react";

import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import CustomSelect from "@/ui/CustomSelect";
import type { User } from "@/type/user";

const cancelWindowOptions = [
  { value: 0, label: "No policy" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];

type Props = {
  user: User;
};

export default function TeachingPolicies({ user }: Props) {
  const alert = useAlert();
  const { updatePolicy, isLoading } = useAuth();
  const [noShowFee, setNoShowFee] = useState(user?.no_show_fee_percent ?? 100);
  const [lateFee, setLateFee] = useState(
    user?.late_cancellation_fee_percent ?? 100,
  );
  const [cancelWindow, setCancelWindow] = useState(
    user?.cancellation_window_hours ?? 24,
  );

  async function handleSavePolicy() {
    const res = await updatePolicy({
      no_show_fee_percent: noShowFee,
      late_cancellation_fee_percent: lateFee,
      cancellation_window_hours: cancelWindow,
    });

    if (res.success) {
      alert.success("Policy saved.");
    } else {
      alert.error(res.error || "Failed to save policy.");
    }
  }
  return (
    <div className="items-center gap-4 rounded-xl border border-gray-300 bg-white px-6 py-4 md:my-10 md:px-8 md:py-6">
      <div className="flex justify-between pb-4 md:pb-6">
        <div>
          <h2 className="text-xl font-semibold">Teaching Policies</h2>
          <p className="mt-1 text-sm text-gray-400">
            This policy is shown to students and used as a reference when
            creating invoices for no-shows or late cancellations.
          </p>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {/* Cancellation window */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Cancellation window
            </p>
            <p className="text-xs text-gray-400">
              How many hours before the lesson counts as a late cancellation
            </p>
          </div>
          <CustomSelect
            name="cancelWindow"
            className="w-36"
            value={cancelWindowOptions.find((o) => o.value === cancelWindow)}
            onChange={(opt: { value: number; label: string } | null) =>
              setCancelWindow(opt?.value ?? 24)
            }
            options={cancelWindowOptions}
          />
        </div>

        {/* Late cancellation fee */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Late cancellation fee
            </p>
            <p className="text-xs text-gray-400">
              % of lesson rate charged when student cancels late
            </p>
          </div>
          <div className="flex gap-2">
            {[0, 50, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setLateFee(pct)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  lateFee === pct
                    ? "budge-purple"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* No-show fee */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-700">No-show fee</p>
            <p className="text-xs text-gray-400">
              % of lesson rate charged when student doesn't show up
            </p>
          </div>
          <div className="flex gap-2">
            {[0, 50, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setNoShowFee(pct)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  noShowFee === pct
                    ? "budge-purple"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSavePolicy}
          disabled={isLoading}
          className="btn-primary-pink"
        >
          {isLoading ? "Saving…" : "Save policy"}
        </button>
      </div>
    </div>
  );
}
