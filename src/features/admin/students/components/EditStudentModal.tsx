import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import ISO6391 from "iso-639-1";

import type { User } from "../../../../type/user";
import { capitalize, initials } from "../../../../utils/helper";
import CustomSelect from "../../../../ui/CustomSelect";
import { useUser } from "../hooks/useUser";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isSaving?: boolean;
};

export default function EditStudentModal({
  isOpen,
  onClose,
  user,
  isSaving,
}: Props) {
  const codes = ISO6391.getAllCodes();

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    user.learning_languages ?? [],
  );

  const { updateStudentMutation } = useUser(user.id, {});

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      await updateStudentMutation({
        first_name: fd.get("first_name") as string,
        last_name: fd.get("last_name") as string,
        email: fd.get("email") as string,
        learning_languages: selectedLanguages,
      });

      onClose();
    } catch {
      // handled by the mutation's onError
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Edit student
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {/* Avatar preview */}
          <div className="mb-5 flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="bg-theme-purple-30 text-theme-purple-50 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-semibold">
                {initials(user.first_name, user.last_name)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="sm-label">First name</label>
              <input
                name="first_name"
                type="text"
                required
                defaultValue={user.first_name}
                className="form-input"
              />
            </div>
            <div>
              <label className="sm-label">Last name</label>
              <input
                name="last_name"
                type="text"
                required
                defaultValue={user.last_name}
                className="form-input"
              />
            </div>
          </div>

          {/* Email & Languages*/}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div>
              <label className="sm-label">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={user.email}
                className="form-input"
              />
            </div>
            <div>
              <label className="sm-label">Learning languages</label>
              <CustomSelect
                isMulti
                name="learning_languages"
                value={selectedLanguages.map((lang) => ({
                  value: lang,
                  label: capitalize(lang),
                }))}
                options={codes.map((code) => ({
                  value: ISO6391.getName(code),
                  label: capitalize(ISO6391.getName(code)),
                }))}
                onChange={(selected: any) =>
                  setSelectedLanguages(
                    selected ? selected.map((s: any) => s.value) : [],
                  )
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
