import ISO6391 from "iso-639-1";

import { type Level } from "../../../../utils/constants";
import { inviteUser } from "../../../../api/users";
import { fdString } from "../../../../utils/formData";
import { useAlert } from "../../../../contexts/AlertContext";
import CustomSelect from "../../../../ui/CustomSelect";
import ModalShell from "../../../../ui/ModalShell";
import { useState } from "react";

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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  if (!isOpen) {
    return null;
  }
  const codes = ISO6391.getAllCodes();

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (selectedLanguages.length === 0) {
        alert.error("Need to select at least one languages");
      }

      const data = {
        email: fdString(formData, "email"),
        level: fdString(formData, "level") as Level,
        first_name: fdString(formData, "first_name"),
        last_name: fdString(formData, "last_name"),
        learning_languages: selectedLanguages,
      };

      const res = await inviteUser(data);

      if (res.success) {
        alert.success(res.data.message);
        onClose();
      } else {
        alert.error(res.error || "Failed to send invitation. Try again later.");
      }
    } catch (err) {
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
          <div className="mb-2">
            <label className="sm-label">Email</label>
            <input name="email" type="email" required className="form-input" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="mb-2">
              <label className="sm-label">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                className="form-input"
              />
            </div>

            <div className="mb-2">
              <label className="sm-label">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="sm-label">Learning Languages</label>
            <CustomSelect
              isMulti
              name="learning_languages"
              required
              className="w-full capitalize"
              options={codes.map((code) => ({
                value: ISO6391.getName(code),
                label: ISO6391.getName(code),
              }))}
              onChange={(selected: any) =>
                setSelectedLanguages(
                  selected ? selected.map((s: any) => s.value) : [],
                )
              }
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-4"
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
