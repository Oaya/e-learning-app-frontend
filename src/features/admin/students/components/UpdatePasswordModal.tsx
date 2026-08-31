import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import { fdString } from "@/utils/formData";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";

type UpdatePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UpdatePasswordModal({
  isOpen,
  onClose,
}: UpdatePasswordModalProps) {
  const alert = useAlert();
  const { updatePassword, isLoading } = useAuth();
  if (!isOpen) {
    return null;
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        current_password: fdString(formData, "current_password"),
        new_password: fdString(formData, "new_password"),
      };

      const res = await updatePassword(data);

      if (res.success) {
        alert.success(res.data.message);
        onClose();
      } else {
        alert.error(res.error || "Failed to update password. Try again later.");
      }
    } catch (err) {
      alert.error("Failed to update password. Try again later.");
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Update Password"
      maxWidth="max-w-2xl"
    >
      <div className="px-6 py-5">
        <p>
          Please enter your current password and the new password you would like
          to set.
        </p>
        <form onSubmit={handleUpdatePassword} className="my-6">
          <div className="grid-cols-2 gap-3 md:grid">
            <FormField label="Current Password" className="mb-2">
              <input
                name="current_password"
                type="password"
                required
                className="form-input"
              />
            </FormField>

            <FormField label="New Password" className="mb-2">
              <input
                name="new_password"
                type="password"
                required
                className="form-input"
              />
            </FormField>
          </div>

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
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
