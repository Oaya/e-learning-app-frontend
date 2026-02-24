import { useState } from "react";
import { FiFilter } from "react-icons/fi";

import { useAlert } from "../../../contexts/AlertContext";
import { useUsers } from "../../../hooks/useUsers";
import InviteUserModal from "../../../components/ui/InviteUserModal";
import { useAuth } from "../../../contexts/AuthContext";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { inviteUser } from "../../../api/users";
import UserFilterDropDown from "./UserFilterDropDown";
import UsersTable from "./UsersTable";

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
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  function closeAction() {
    setActionOpen(false);
  }

  const uData = users || [];

  const selectedUsers = uData.filter((u) => selected.has(u.id));
  const selectedEmails = selectedUsers.map((u) => u.email);
  const isAdmin = user?.role === "admin";

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
      <div className="flex">
        <input
          className="form-input w-full"
          type="text"
          placeholder="Search user by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="relative ml-6">
          <button
            className="bg-theme-purple-40 text-theme-purple-20 mr-6 flex h-11.5 cursor-pointer items-center justify-center rounded px-4 shadow-xl"
            onClick={() => setOpenFilter((v) => !v)}
          >
            <FiFilter size={18} className="text-theme-purple-20 mr-2 flex" />
            Filters
          </button>

          {openFilter && (
            <UserFilterDropDown
              onClose={() => setOpenFilter(false)}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
        </div>
      </div>

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

      <UsersTable />
    </div>
  );
}
