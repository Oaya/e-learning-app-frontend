import { useState } from "react";
import { GoPencil } from "react-icons/go";

import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  if (!user) return <p>Loading…</p>;

  const initialProfile = {
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    avatar: user.avatar ?? null,
  };

  const [firstName, setFirstName] = useState(initialProfile.first_name);
  const [lastName, setLastName] = useState(initialProfile.last_name);
  const [email, setEmail] = useState(initialProfile.email);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
    user?.avatar || null,
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (avatarPreviewUrl && avatarFile) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarFile(file);
    setAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (avatarFile) {
      data.append("avatar", avatarFile, avatarFile.name);
    }
    updateUser(data);
  };

  const isDirty =
    firstName !== initialProfile.first_name ||
    lastName !== initialProfile.last_name ||
    email !== initialProfile.email ||
    avatarFile !== null ||
    avatarPreviewUrl !== initialProfile.avatar;

  if (!user) return <p>Loading…</p>;
  return (
    <div>
      <h2 className="text-3xl font-semibold">Profile & settings</h2>

      <div className="mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <h2 className="text-xl font-semibold">Profile</h2>

          <div className="flex justify-center">
            <div className="group relative h-32 w-32">
              <img
                src={avatarPreviewUrl || user?.avatar || "/src/assets/user.png"}
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
                <div className="sm-label">Tenant</div>
                <div className="read-only-input">{user.tenant_name ?? "-"}</div>
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
                <div className="sm-label">User Role</div>
                <div className="read-only-input">{user.role ?? "-"}</div>
              </div>

              <div className="mb-2">
                <label className="sm-label">Password</label>

                <div className="flex gap-2">
                  <div className="read-only-input w-full">************</div>

                  <button
                    type="button"
                    className="bg-dark-purple flex h-11.5 items-center justify-center rounded border px-3 text-white"
                    aria-label="Change password"
                  >
                    <GoPencil size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={!isDirty}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
