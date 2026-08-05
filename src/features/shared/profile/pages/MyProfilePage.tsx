import { useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useAuth } from "../../../../contexts/AuthContext";
import { ADMIN_PLAN_STATUS_BADGE } from "../../../../utils/constants";
import Badge from "../../../../ui/Badge";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import UpdateSubscriptionModal from "../components/UpdateSubscriptionModal";
import UserProfileSection from "../components/UserProfileSection";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function MyProfilePage() {
  const { user } = useAuth();

  const [isUpdatePlanModalOpen, setIsUpdatePlanModalOpen] = useState(false);
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] =
    useState(false);

  const isAdmin = user?.role === "admin";
  const isCanceled =
    user?.subscription?.cancel_at_period_end ||
    user?.subscription?.status === "canceled";

  // NOW it's safe to conditional render (after hooks)
  if (!user) return <p>Loading…</p>;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Profile & Settings
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Manage your account details and preferences
          </p>
        </div>
      </div>

      <UserProfileSection user={user} />
      {isAdmin && (
        <div className="items-center gap-4 rounded-xl border border-gray-300 bg-white px-8 py-6">
          <div className="flex justify-between pb-8">
            <h2 className="text-xl font-semibold">Billing</h2>
            {user.subscription && (
              <Badge
                status={user.subscription.status}
                constant={ADMIN_PLAN_STATUS_BADGE}
                className="px-4 py-1 text-[16px]"
              />
            )}
          </div>

          {user.subscription?.cancel_at_period_end && (
            <p className="text-xl font-bold text-red-500">
              Your Subscription will be canceled at the Access Ends Date
            </p>
          )}
          <div>
            <div className="flex justify-between border-b border-gray-200 py-4">
              <p className="text-lg font-semibold">Plan</p>
              <p className="capitalize">
                {user.subscription?.plan ? user.subscription?.plan : "-"}
              </p>
            </div>

            <div className="flex justify-between border-b border-gray-200 py-4">
              <p className="text-lg font-semibold">
                {user.subscription?.cancel_at_period_end
                  ? "Access Ends"
                  : "Next Billing Date"}
              </p>
              <p>
                {user.subscription?.current_period_end
                  ? dayjs(user.subscription?.current_period_end).format(
                      "YYYY-MM-DD",
                    )
                  : "-"}
              </p>
            </div>

            <div className="flex justify-between border-b border-gray-200 py-4">
              <p className="text-lg font-semibold">Amount</p>
              <p>${user.subscription?.price} / month</p>
            </div>
          </div>

          {isCanceled ? (
            <div className="mt-8 flex justify-end">
              <button
                className="btn-primary"
                onClick={() => setIsUpdatePlanModalOpen(true)}
              >
                Reactivate Subscription
              </button>
            </div>
          ) : (
            <div className="mt-8 flex justify-end">
              <button
                className="btn-primary"
                onClick={() => setIsUpdatePlanModalOpen(true)}
              >
                Change Plan
              </button>

              <button
                className="btn-primary-pink ml-4"
                onClick={() => setIsCancelSubscriptionModalOpen(true)}
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      )}

      <CancelSubscriptionModal
        isOpen={isCancelSubscriptionModalOpen}
        onClose={() => setIsCancelSubscriptionModalOpen(false)}
      />
      <UpdateSubscriptionModal
        isOpen={isUpdatePlanModalOpen}
        onClose={() => setIsUpdatePlanModalOpen(false)}
        plan={user.subscription?.plan as string}
        mode={isCanceled ? "Reactivate" : "Update"}
      />
    </div>
  );
}
