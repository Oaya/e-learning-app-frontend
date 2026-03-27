import { useEffect, useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import ReactPaginate from "react-paginate";

import { useAlert } from "../../../../contexts/AlertContext";
import { useUsers } from "../hooks/useUsers";
import InviteUserModal from "../components/InviteUserModal";
import { useAuth } from "../../../../contexts/AuthContext";
import ConfirmModal from "../../../../ui/ConfirmModal";
import { inviteUser } from "../../../../api/users";
import UserFilterDropDown from "../components/UserFilterDropDown";
import UsersTable from "../components/UsersTable";
import { useUserSelections } from "../hooks/useUserSelections";
import { useUserTableControl } from "../hooks/userUserTableControl";

export default function UsersPage() {
  const alert = useAlert();
  const { user } = useAuth();

  const [isInviteOpen, setInviteOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [userOffset, setUserOffset] = useState(0);
  const isAdmin = user?.role === "admin";

  const {
    sorts,
    selectedFilters,
    filters,
    openedFilter,
    chips,
    toggleSort,
    removeFilterChip,
    handleToggleFilter,
    updateSelectedFilters,
  } = useUserTableControl();

  const {
    users = [],
    isLoading,
    isError,
    error,
    deleteUsersMutation,
    isDeleting,
  } = useUsers({ filters: selectedFilters, search: searchInput, sorts });

  const itemsPerPage = 10;
  const endOffset = userOffset + itemsPerPage;

  const displayUsers = useMemo(() => {
    return users.slice(userOffset, endOffset);
  }, [users, userOffset, endOffset]);

  const pageCount = Math.ceil(users.length / itemsPerPage);

  useEffect(() => {
    setUserOffset(0);
  }, [searchInput, selectedFilters, sorts]);

  function handlePageClick(event: { selected: number }) {
    const newOffset = event.selected * itemsPerPage;
    setUserOffset(newOffset);
  }

  const {
    selected,
    clearSelection,
    selectedUsers,
    selectedEmails,
    allSelected,
    toggleOne,
    toggleAll,
  } = useUserSelections(displayUsers, user?.id);

  function closeAction() {
    setActionOpen(false);
  }

  async function handleBulkSendInvite() {
    try {
      if (selectedUsers.length > 0) {
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
          alert.error(
            res.error || "Failed to send invitation. Try again later.",
          );
        }
      }
    } catch {
      alert.error("Failed to send invitation. Try again later.");
    } finally {
      closeAction();
      clearSelection();
    }
  }

  function deleteUsers() {
    deleteUsersMutation([...selected]);
    closeAction();
    clearSelection();
    setDeleteModalOpen(false);
  }

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        {error instanceof Error ? error.message : "Failed to load users"}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {isInviteOpen && (
        <InviteUserModal
          isOpen={isInviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Delete Users"
          message={`Are you sure you want to delete ${selectedEmails.join(", ")}? This action cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={deleteUsers}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
      </div>

      <div className="flex">
        <input
          className="form-input w-full"
          type="text"
          placeholder="Search user by First, Last name or Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="relative ml-6">
          <button
            className="bg-theme-purple-40 text-theme-purple-20 flex h-11.5 cursor-pointer items-center justify-center rounded px-4 shadow-xl"
            onClick={() => setOpenFilter((v) => !v)}
          >
            <FiFilter size={18} className="text-theme-purple-20 mr-2 flex" />
            Filters
          </button>

          {openFilter && (
            <UserFilterDropDown
              onClose={() => setOpenFilter(false)}
              selectedFilters={selectedFilters}
              filters={filters}
              openedFilter={openedFilter}
              onHandleToggleFilter={handleToggleFilter}
              onUpdateSelectedFilters={updateSelectedFilters}
            />
          )}
        </div>
      </div>

      <div>
        {chips.map((chip) => (
          <span
            key={chip.label}
            className="bg-theme-purple-40 text-theme-purple-20 mr-4 inline-block rounded-full px-2 py-1 text-sm shadow"
          >
            {chip.label}
            <IoIosClose
              size={20}
              className="ml-1 inline-block"
              onClick={() => removeFilterChip(chip.key, chip.value)}
            />
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="mr-4 text-sm font-semibold text-gray-500">
            {users.length} results
          </span>
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
                        onClick={() => setDeleteModalOpen(true)}
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

      <UsersTable
        users={displayUsers}
        sorts={sorts}
        selected={selected}
        allSelected={allSelected}
        onToggleSort={toggleSort}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
      />

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="mt-4 flex items-center justify-center gap-2"
          pageClassName="rounded border px-3 py-1"
          activeClassName="bg-gray-200 font-semibold"
          previousClassName="rounded border px-3 py-1"
          nextClassName="rounded border px-3 py-1"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
}
