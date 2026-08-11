import React, { useEffect, useMemo, useState } from "react";
import { GoPencil } from "react-icons/go";
import { BsStars } from "react-icons/bs";

import defaultAvatar from "@/assets/user.png";
import TimezoneSelector from "@/ui/TimezoneSelector";
import type { User } from "@/type/user";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import UpdatePasswordModal from "@/features/admin/students/components/UpdatePasswordModal";

type Props = {
  user: User;
};

export default function UserProfileSection({ user }: Props) {
  const { updateUser, isLoading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState<string>("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const alert = useAlert();

  useEffect(() => {
    if (!user) return;

    function setDefaultFormValue() {
      setFirstName(user?.first_name ?? "");
      setLastName(user?.last_name ?? "");
      setEmail(user?.email ?? "");
      setAvatarPreviewUrl(user?.avatar ?? null);
      setTimezone(user?.timezone ?? "");
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
      avatar: avatarFile ?? undefined, // omit when no new file chosen so the existing avatar isn't cleared
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

  return (
    <div>
      <div className="my-10 items-center gap-10 rounded-xl border border-gray-300 bg-white px-8 py-6">
        <h2 className="pb-8 text-xl font-semibold">Personal information</h2>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="mb-8 flex gap-6 gap-y-10 border-b border-gray-300 pb-6">
            <div className="group relative h-28 w-28">
              <img
                src={avatarPreviewUrl || user.avatar || defaultAvatar}
                alt="avatar"
                className="h-28 w-28 rounded-full object-cover"
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

            <div className="flex-1 flex-col">
              <h1 className="text-2xl font-semibold">
                {user.first_name} {user.last_name}
              </h1>
              <p>{user.email}</p>
              {user.role === "admin" ? (
                <div
                  className={`bg-theme-green-30 text-theme-green-20 mt-2 inline-flex w-fit items-center justify-center gap-1 rounded-full px-4 py-1 capitalize`}
                >
                  <BsStars />
                  <p>
                    {user.subscription?.plan
                      ? user.subscription?.plan + " Plan"
                      : null}
                  </p>
                </div>
              ) : (
                user.learning_languages &&
                user.learning_languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.learning_languages.map((language) => (
                      <span
                        key={language}
                        className="bg-theme-green-30 text-theme-green-20 w-fit rounded-full px-2 py-1 text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="sm-label">First Name</label>
              <input
                name="first_name"
                className="form-input"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="sm-label">Last Name</label>
              <input
                name="last_name"
                className="form-input"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="sm-label">Email</label>
              <input
                name="email"
                className="form-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="sm-label">Time zone</label>
              <TimezoneSelector value={timezone} onChange={setTimezone} />
            </div>
          </div>

          <div className="my-4 flex justify-end">
            <button
              className="btn-primary"
              type="submit"
              disabled={!isDirty || isLoading}
            >
              Save Changes
            </button>
          </div>
        </form>

        <div className="flex justify-between border-t border-gray-300 py-4">
          <div>
            <label className="sm-label">Password</label>
            <p className="text-2xl font-extrabold">••••••••••</p>
          </div>

          <div className="btn-primary mt-4 flex w-fit justify-end">
            <button onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </button>
          </div>
        </div>
      </div>

      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
