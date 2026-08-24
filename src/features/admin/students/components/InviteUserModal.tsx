import ISO6391 from "iso-639-1";
import { useState } from "react";

import { inviteUser } from "@/api/users";
import { fdString } from "@/utils/formData";
import { useAlert } from "@/contexts/AlertContext";
import { levels, type LanguageLevel } from "@/type/user";
import CustomSelect from "@/ui/CustomSelect";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InviteUserModal({
  isOpen,
  onClose,
}: InviteUserModalProps) {
  const alert = useAlert();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);

  if (!isOpen) return null;

  const codes = ISO6391.getAllCodes();
  const selectedLanguages = languageLevels.map((ll) => ll.language);

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
    setLanguageLevels((prev) =>
      prev.map((ll) =>
        ll.language === language
          ? { ...ll, level: level as LanguageLevel["level"] }
          : ll,
      ),
    );
  }

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (languageLevels.length === 0) {
      alert.error("Please select at least one language.");
      return;
    }

    try {
      setIsSubmitting(true);
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        email: fdString(formData, "email"),
        first_name: fdString(formData, "first_name"),
        last_name: fdString(formData, "last_name"),
        language_levels: languageLevels,
      };

      const res = await inviteUser(data);

      if (res.success) {
        alert.success(res.data.message);
        onClose();
      } else {
        alert.error(res.error || "Failed to send invitation. Try again later.");
      }
    } catch {
      alert.error("Failed to send invitation. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Invite a new student"
      maxWidth="max-w-2xl"
    >
      <div className="px-6 py-5">
        <p>
          An invitation will be sent to this email address with a link to
          complete their account.
        </p>
        <form onSubmit={handleInvite} className="my-6">
          <FormField label="Email" className="mb-2">
            <input name="email" type="email" required className="form-input" />
          </FormField>

          <div className="grid md:grid-cols-2 md:gap-6">
            <FormField label="First Name" className="md:mb-2">
              <input
                name="first_name"
                type="text"
                required
                className="form-input"
              />
            </FormField>

            <FormField label="Last Name" className="mb-2">
              <input
                name="last_name"
                type="text"
                required
                className="form-input"
              />
            </FormField>
          </div>

          <FormField label="Learning Languages" className="mb-2">
            <CustomSelect
              isMulti
              name="language_levels"
              className="w-full capitalize"
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
                      <select
                        value={ll?.level ?? "A1-Beginner"}
                        onChange={(e) => setLevel(lang, e.target.value)}
                        className="form-input py-1 text-xs capitalize"
                      >
                        {levels.map((lv) => (
                          <option key={lv} value={lv}>
                            {lv}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </FormField>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary-pink"
              disabled={!!isSubmitting}
            >
              {isSubmitting ? "Sending Invite..." : "Invite"}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
