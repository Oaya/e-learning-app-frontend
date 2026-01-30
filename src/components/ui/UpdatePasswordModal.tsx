import { AiOutlineClose } from "react-icons/ai";

import { fdString } from "../../utils/formData";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Update Password</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        <p>
          Please enter your current password and the new password you would like
          to set.
        </p>
        <form onSubmit={handleUpdatePassword} className="my-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="mb-2">
              <label className="sm-label">Current Password</label>
              <input
                name="current_password"
                type="password"
                required
                className="form-input"
              />
            </div>

            <div className="mb-2">
              <label className="sm-label">New Password</label>
              <input
                name="new_password"
                type="password"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-2"
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
    </div>
  );
}
