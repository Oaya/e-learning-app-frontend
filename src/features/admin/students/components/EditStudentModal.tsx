import { useState } from "react";
import ISO6391 from "iso-639-1";

import {
  statusValue,
  type Status,
  type User,
  type LanguageLevel,
  levels,
} from "@/type/user";
import CustomSelect from "@/ui/CustomSelect";
import { useUser } from "@/features/admin/students/hooks/useUser";
import TimezoneSelector from "@/ui/TimezoneSelector";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import { useAlert } from "@/contexts/AlertContext";
import defaultAvatar from "@/assets/user.png";

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

  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>(
    user.language_levels ?? [],
  );
  // Derive language list from languageLevels
  const selectedLanguages = languageLevels.map((ll) => ll.language);
  const [timezone, setTimezone] = useState<string | undefined>(user.timezone);
  const [status, setStatus] = useState<Status | undefined>(user.status);
  const alert = useAlert();

  const { updateStudent } = useUser(user.id, {});

  if (!isOpen) return null;

  function handleLanguagesChange(langs: string[]) {
    setLanguageLevels((prev) =>
      langs.map(
        (lang) =>
          prev.find((ll) => ll.language === lang) ?? {
            language: lang,
            level: "A1-Beginner" as LanguageLevel["level"],
          },
      ),
    );
  }

  function setLevel(language: string, level: string) {
    setLanguageLevels((prev) => {
      const exists = prev.some((ll) => ll.language === language);
      if (!exists) {
        return [...prev, { language, level: level as LanguageLevel["level"] }];
      }
      return prev.map((ll) =>
        ll.language === language
          ? { ...ll, level: level as LanguageLevel["level"] }
          : ll,
      );
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      if (!status) {
        alert.error("Missing status");
        return;
      }

      const finalLanguageLevels: LanguageLevel[] = selectedLanguages.map(
        (lang) =>
          languageLevels.find((ll) => ll.language === lang) ?? {
            language: lang,
            level: "A1-Beginner",
          },
      );

      await updateStudent({
        first_name: fd.get("first_name") as string,
        last_name: fd.get("last_name") as string,
        email: fd.get("email") as string,
        language_levels: finalLanguageLevels,
        timezone: timezone ?? "",
        status: status,
      });

      onClose();
    } catch {
      // handled by the mutation's onError
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="px-6 py-5">
        {/* Avatar preview */}
        <div className="mb-5 flex items-center gap-4">
          <img
            src={user.avatar || defaultAvatar}
            alt="avatar"
            className="h-14 w-14 rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-medium text-gray-700">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 md:gap-4">
          {/* Name */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
            <FormField label="First name">
              <input
                name="first_name"
                type="text"
                required
                defaultValue={user.first_name}
                className="form-input"
              />
            </FormField>
            <FormField label="Last name">
              <input
                name="last_name"
                type="text"
                required
                defaultValue={user.last_name}
                className="form-input"
              />
            </FormField>
          </div>

          {/* Email & Languages*/}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
            <FormField label="Email">
              <input
                name="email"
                type="email"
                required
                defaultValue={user.email}
                className="form-input"
              />
            </FormField>
            <FormField label="Learning languages">
              <CustomSelect
                isMulti
                className="form-select capitalize"
                name="learning_languages"
                value={selectedLanguages.map((lang) => ({
                  value: lang,
                  label: lang,
                }))}
                options={codes.map((code) => ({
                  value: ISO6391.getName(code),
                  label: ISO6391.getName(code),
                }))}
                onChange={(selected: any) =>
                  handleLanguagesChange(
                    selected ? selected.map((s: any) => s.value) : [],
                  )
                }
              />

              {/* Level per language */}
              {selectedLanguages.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {selectedLanguages.map((lang) => {
                    const ll = languageLevels.find((l) => l.language === lang);
                    return (
                      <div key={lang} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 truncate text-xs text-gray-500">
                          {lang}
                        </span>
                        <div className="level-select w-full">
                          <CustomSelect
                            className="form-select w-full text-xs capitalize"
                            value={{
                              value: ll?.level ?? "A1-Beginner",
                              label: ll?.level ?? "A1-Beginner",
                            }}
                            options={levels.map((lv) => ({
                              value: lv,
                              label: lv,
                            }))}
                            onChange={(selected: any) =>
                              setLevel(lang, selected.value)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </FormField>
          </div>

          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
            <FormField label="Time zone">
              <TimezoneSelector value={timezone} onChange={setTimezone} />
            </FormField>
            <FormField label="Status">
              <CustomSelect
                name="status"
                className="form-select capitalize"
                required
                value={status ? { value: status, label: status } : null}
                options={statusValue.map((s) => ({
                  value: s,
                  label: s,
                }))}
                onChange={(selected: any) =>
                  setStatus(selected ? selected.value : undefined)
                }
              />
            </FormField>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-primary-white">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary-pink"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
