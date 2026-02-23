import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useAlert } from "../../../contexts/AlertContext";
import { useUsers } from "../../../hooks/useUsers";
import InviteUserModal from "../../../components/ui/InviteUserModal";
import { useAuth } from "../../../contexts/AuthContext";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { capitalize } from "../../../utils/helper";
import { inviteUser } from "../../../api/users";

export default function UsersPage() {
  const alert = useAlert();
  const { user } = useAuth();
  const { users, isLoading, isError, error, deleteUsersMutation, isDeleting } =
    useUsers();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionOpen, setActionOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  function closeAction() {
    setActionOpen(false);
  }

  const uData = users || [];

  const allSelected = uData.length > 0 && selected.size === uData.length - 1; // Exclude current user;
  const selectedUsers = uData.filter((u) => selected.has(u.id));
  const selectedEmails = selectedUsers.map((u) => u.email);
  const isAdmin = user?.role === "admin";
  const currentUserId = user?.id;
  const isSelf = (id: string) => id === currentUserId;

  function toggleAll() {
    const ids = uData.filter((u) => u.id !== currentUserId).map((u) => u.id);

    const allSelected = ids.length > 0 && selected.size === ids.length;

    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Example actions
  async function handleBulkSendInvite() {
    try {
      const res = await inviteUser(
        selectedUsers.map((u) => ({
          email: u.email,
          role: u.role,
          first_name: u.first_name,
          last_name: u.last_name,
        })),
      );

      if (res.success) {
        alert.success(res.data.message);
      } else {
        alert.error(res.error || "Failed to send invitation. Try again later.");
      }
    } catch (err) {
      alert.error("Failed to send invitation. Try again later.");
    } finally {
      closeAction();
      setSelected(new Set());
    }
  }

  function deleteUsers() {
    deleteUsersMutation([...selected]);
    closeAction();
    setSelected(new Set());
    setDeleteModalOpen(false);
  }

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (isError)
    alert.error(error instanceof Error ? error.message : "Failed to load");

  return (
    <div className="space-y-4 p-6">
      {/* Invite user Modal */}

      {isInviteOpen && (
        <InviteUserModal
          isOpen={isInviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
      </div>

      {/* Delete user modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Delete Users"
          message={`Are you sure you want to delete ${selectedEmails.join(", ")}? This action cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={() => {
            deleteUsers();
          }}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

      {/* search input */}

      <input
        className="form-input w-full"
        type="text"
        placeholder="Search user by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <div>
          <span className="mr-4 text-sm font-semibold text-gray-500">
            Showing {uData.length} result{uData.length !== 1 ? "s" : ""}
          </span>

          <span>Display 100</span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActionOpen((v) => !v)}
                  disabled={selected.size === 0}
                >
                  Actions
                </button>

                {actionOpen && (
                  <>
                    {/* click-outside overlay */}
                    <div className="fixed inset-0 z-10" onClick={closeAction} />

                    <div className="absolute right-0 z-20 mt-2 w-36 rounded border bg-white shadow">
                      <button
                        type="button"
                        className="w-full rounded-t border-b px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={handleBulkSendInvite}
                      >
                        Send Invitation
                      </button>

                      <button
                        type="button"
                        className="w-full rounded px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => isAdmin && setDeleteModalOpen(true)}
                      >
                        Delete selected
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                className="btn-primary"
                onClick={() => setInviteOpen(true)}
              >
                Invite User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-theme-purple-10/20 text-left">
              {isAdmin && (
                <th className="w-10 p-3">
                  {allSelected ? (
                    <IoIosCheckbox
                      size={18}
                      className="text-theme-purple-10 cursor-pointer"
                      onClick={toggleAll}
                    />
                  ) : (
                    <MdOutlineCheckBoxOutlineBlank
                      size={18}
                      className="text-theme-purple-10 cursor-pointer"
                      onClick={toggleAll}
                    />
                  )}
                </th>
              )}

              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>

              {isAdmin && <th className="p-3">Status</th>}
            </tr>
          </thead>

          <tbody>
            {uData.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : (
              uData.map((u) => (
                <tr key={u.id} className="border-t">
                  {isAdmin && (
                    <td className="p-3">
                      {isSelf(u.id) ? (
                        <span className="cursor-not-allowed opacity-40">
                          <MdOutlineCheckBoxOutlineBlank
                            size={18}
                            className="text-theme-purple-10"
                          />
                        </span>
                      ) : selected.has(u.id) ? (
                        <IoIosCheckbox
                          className="text-theme-purple-10 cursor-pointer"
                          onClick={() => toggleOne(u.id)}
                          size={18}
                        />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank
                          className="text-theme-purple-10 cursor-pointer"
                          onClick={() => toggleOne(u.id)}
                          size={18}
                        />
                      )}
                    </td>
                  )}

                  <td className="p-3">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {u.first_name} {u.last_name}
                    </Link>
                  </td>

                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{capitalize(u.role) ?? ""}</td>
                  {isAdmin && (
                    <td className="p-3">{capitalize(u.status) ?? ""}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
