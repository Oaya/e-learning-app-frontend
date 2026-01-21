import { AiOutlineClose } from "react-icons/ai";
import { roles } from "../../utils/constants";
import { inviteUser } from "../../api/users";
import { fdString } from "../../utils/formData";
import { useAlert } from "../../contexts/AlertContext";
import CustomSelect from "./CustomSelect";

type InviteUserModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
};

export default function InviteUserModal({
  isOpen,
  isSubmitting,
  onClose,
}: InviteUserModalProps) {
  const alert = useAlert();
  if (!isOpen) {
    return null;
  }

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: fdString(formData, "email"),
      role: fdString(formData, "role"),
      first_name: fdString(formData, "first_name"),
      last_name: fdString(formData, "last_name"),
    };

    const res = await inviteUser(data);

    if (res.success && res.data.message) {
      alert.success(res.data.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Invite new member</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        <p>
          An invitation will be sent to this email address with a link to
          complete their account and/or join your organization.
        </p>
        <form onSubmit={handleInvite} className="my-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 mb-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="form-input"
              />
            </div>

            <div className="col-span-1 mb-2">
              <label className="block text-sm font-medium">Role</label>
              <CustomSelect
                name="role"
                className="w-full"
                required
                options={roles.map((role) => ({ value: role, label: role }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="mb-2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                className="form-input"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                name="last_name"
                type="text"
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
              disabled={!!isSubmitting}
            >
              {isSubmitting ? "Sending Invite..." : "Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
