import { useEffect, useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import ReactPaginate from "react-paginate";

import { useUsers } from "../hooks/useUsers";
import InviteUserModal from "../components/InviteUserModal";
import UserFilterDropDown from "../components/UserFilterDropDown";
import UsersTable from "../components/UsersTable";

import { useUserTableControl } from "../hooks/userUserTableControl";
import { HiOutlineMail, HiUsers } from "react-icons/hi";
import { HiOutlineCheckCircle, HiOutlineCurrencyDollar } from "react-icons/hi2";
import StatCard from "../../../../ui/StatCard";
import { useAllLessons } from "../../lessons/hooks/useAllLessons";

export default function StudentsPage() {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [userOffset, setUserOffset] = useState(0);

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
  } = useUsers({
    filters: selectedFilters,
    search: searchInput,
    sorts,
  });

  const { lessons = [] } = useAllLessons();

  const active = users.filter((u) => u.status === "active").length;

  const unpaid = new Set(
    lessons
      .filter((l) => l.status === "completed" && l.payment_status === "unpaid")
      .map((l) => l.student.id),
  ).size;

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

  if (isLoading) {
    return <div className="p-6">Loading students...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        {error instanceof Error ? error.message : "Failed to load students"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Your Students</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInviteOpen(true)}
            className="btn-primary-pink flex items-center gap-1.5"
          >
            <HiOutlineMail size={16} /> Invite Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
        <StatCard
          icon={HiUsers}
          label="Total student"
          value={users.length ?? 0}
        />
        <StatCard
          icon={HiOutlineCheckCircle}
          label="Active"
          value={active}
          sub="Currently Active"
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Unpaid"
          value={unpaid}
          sub="Owes for lessons"
        />
      </div>

      <div className="flex">
        <input
          className="form-input w-full"
          type="text"
          placeholder="Search student by First, Last name or Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="relative ml-6">
          <button
            className="bg-theme-purple-40 text-theme-purple-50 flex h-11.5 cursor-pointer items-center justify-center rounded px-4 shadow-xl"
            onClick={() => setOpenFilter((v) => !v)}
          >
            <FiFilter size={18} className="text-theme-purple-50 mr-2 flex" />
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
            className="bg-theme-purple-40 text-theme-purple-20 mr-4 inline-block rounded-full px-2 py-1 text-sm capitalize shadow"
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

      <UsersTable
        users={displayUsers}
        sorts={sorts}
        onToggleSort={toggleSort}
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

      {isInviteOpen && (
        <InviteUserModal
          isOpen={isInviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
}
