import React, { useEffect, useMemo, useState } from "react";
import { GoPencil } from "react-icons/go";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import UpdateSubscriptionModal from "../components/UpdateSubscriptionModal";
import { useAlert } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { capitalize } from "../../../../utils/helper";
import UpdatePasswordModal from "../../../admin/students/components/UpdatePasswordModal";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import { UserModel } from "../../../../models/user";
import defaultAvatar from "../../../../assets/user.png";
import TimezoneSelector from "../components/TimezoneSelector";

export default function MyProfilePage() {
  const { user, updateUser, isLoading } = useAuth();

  // Keep local form state, initialized safely even when user is null
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [timezone, setTimezone] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [isUpdatePlanModalOpen, setIsUpdatePlanModalOpen] = useState(false);
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] =
    useState(false);

  console.log(timezone);

  const alert = useAlert();
  const isAdmin = new UserModel(user);
  const isCanceled =
    user?.subscription?.cancel_at_period_end ||
    user?.subscription?.status === "canceled";

  // When user loads/changes, hydrate the form state
  useEffect(() => {
    if (!user) return;

    function setDefaultFormValue() {
      setFirstName(user?.first_name ?? "");
      setLastName(user?.last_name ?? "");
      setEmail(user?.email ?? "");
      setAvatarPreviewUrl(user?.avatar ?? null);
      setTimezone(user?.timezone ?? null);
      // Clear pending file selection when user changes
      setAvatarFile(null);
    }

    setDefaultFormValue();
  }, [user]);

  // Clean up object URLs on unmount / when replaced
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old blob preview URL if any
    if (avatarPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await updateUser({
      first_name: firstName,
      last_name: lastName,
      email,
      timezone: timezone,
      avatar: avatarFile, // File or null/undefined depending on your API contract
    });

    if (res.success) {
      alert.success("Profile updated successfully");
    } else {
      alert.error(`Failed to update profile: ${res.error}`);
    }
  };

  const initialProfile = useMemo(() => {
    return {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      timezone: user?.timezone ?? null,
      avatar: user?.avatar ?? null,
    };
  }, [user]);

  const isDirty =
    firstName !== initialProfile.first_name ||
    lastName !== initialProfile.last_name ||
    email !== initialProfile.email ||
    timezone !== initialProfile.timezone ||
    avatarFile !== null ||
    avatarPreviewUrl !== initialProfile.avatar;

  // NOW it's safe to conditional render (after hooks)
  if (!user) return <p>Loading…</p>;

  return (
    <div className="p-10">
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
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
      <h2 className="text-3xl font-semibold">Profile & settings</h2>

      <div className="mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <h2 className="text-xl font-semibold">Profile</h2>

          <div className="flex justify-center">
            <div className="group relative h-32 w-32">
              <img
                src={avatarPreviewUrl || user.avatar || defaultAvatar}
                alt="avatar"
                className="h-32 w-32 rounded-full object-cover"
              />

              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <GoPencil className="text-2xl text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-2">
                <label className="sm-label">First Name</label>
                <input
                  name="first_name"
                  className="form-input"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="sm-label">Email</label>
                <input
                  name="email"
                  className="form-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <label className="sm-label">Last Name</label>
                <input
                  name="last_name"
                  className="form-input"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <div className="sm-label">Time zone</div>
                <TimezoneSelector value={timezone} onChange={setTimezone} />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label className="sm-label">Password</label>

            <div className="flex gap-2">
              <div className="read-only-input w-full">************</div>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                type="button"
                className="bg-theme-purple-20 flex h-11.5 items-center justify-center rounded border px-3 text-white"
                aria-label="Change password"
              >
                <GoPencil size={16} />
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={!isDirty || isLoading}
          >
            Save Changes
          </button>
        </form>
      </div>

      {isAdmin && (
        <div className="mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
          <h2 className="text-xl font-semibold">Billing Info</h2>
          {user.subscription?.cancel_at_period_end && (
            <p className="text-xl font-bold text-red-500">
              Your account will be canceled at the Access ends Date
            </p>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-2">
                <div className="sm-label">Plan</div>
                <div className="read-only-input">
                  {user.subscription?.plan
                    ? capitalize(user.subscription?.plan)
                    : "-"}
                </div>
              </div>

              <div className="mb-2">
                <div className="sm-label">
                  {user.subscription?.cancel_at_period_end
                    ? "Access Ends"
                    : "Next Billing Date"}
                </div>
                <div className="read-only-input">
                  {" "}
                  {user.subscription?.current_period_end
                    ? new Date(
                        user.subscription?.current_period_end,
                      ).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <div className="sm-label">Status</div>
                <div className="read-only-input">
                  {user.subscription?.status
                    ? capitalize(user.subscription?.status)
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {isCanceled ? (
            <button
              className="btn-primary"
              onClick={() => setIsUpdatePlanModalOpen(true)}
            >
              Reactivate Subscription
            </button>
          ) : (
            <div>
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
    </div>
  );
}
