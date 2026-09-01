import { useEffect, useMemo, useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { HiOutlineMail } from "react-icons/hi";

import { useUsers } from "@/features/admin/students/hooks/useUsers";
import InviteUserModal from "@/features/admin/students/components/InviteUserModal";
import UserFilterDropDown from "@/features/admin/students/components/UserFilterDropDown";
import UsersTable from "@/features/admin/students/components/UsersTable";
import { useUserTableControl } from "@/features/admin/students/hooks/useUserTableControl";
import PageLoadingState from "@/ui/PageLoadingState";
import { PAGE_SIZE } from "@/utils/constants";

export default function StudentsPage() {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [pastPage, setPastPage] = useState(1);

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

  const { users = [], isLoading, isError, error } = useUsers();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    const result = users.filter((u) => {
      const studentName = `${u.first_name} ${u.last_name}`;

      const matchSearch =
        !q ||
        studentName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchFilters = Object.entries(selectedFilters).every(
        ([key, values]) =>
          values.length === 0 ||
          values.includes(String(u[key as keyof typeof u])),
      );

      return matchSearch && matchFilters;
    });

    if (sorts.length > 0) {
      result.sort((a, b) => {
        for (const { field, dir } of sorts) {
          const aValue = String(a[field as keyof typeof a] ?? "");
          const bValue = String(b[field as keyof typeof b] ?? "");
          const cmp = aValue.localeCompare(bValue);

          if (cmp !== 0) return dir === "asc" ? cmp : -cmp;
        }
        return 0;
      });
    }

    return result;
  }, [users, search, selectedFilters, sorts]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const displayUsers = useMemo(() => {
    const start = (pastPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pastPage]);

  useEffect(() => {
    setPastPage(1);
  }, [search, selectedFilters, sorts]);

  if (isLoading) {
    return <PageLoadingState message="Loading students..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        {error instanceof Error ? error.message : "Failed to load students"}
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Top bar */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Your Students</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Total: {users.length} student{users.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setInviteOpen(true)}
            className="btn-primary-pink"
          >
            <HiOutlineMail size={16} /> Invite Student
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          className="form-input mb-0 h-10.5 w-100 px-3 max-sm:text-[11px]"
          type="text"
          placeholder="Search student by First, Last name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="relative max-sm:ml-2 md:ml-auto">
          <button
            className="btn-white h-10.5 text-xs text-[16px]"
            onClick={() => setOpenFilter((v) => !v)}
          >
            <LuSlidersHorizontal
              size={16}
              className="text-theme-purple-50 flex"
            />
            <span className="hidden sm:inline">Filters</span>
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

      {chips.map((chip) => (
        <span
          key={chip.label}
          className="bg-theme-purple-40 text-theme-purple-50 mr-4 inline-block rounded-full px-2 py-1 text-sm capitalize shadow"
        >
          {chip.label}
          <IoIosClose
            size={18}
            className="ml-1 inline-block"
            onClick={() => removeFilterChip(chip.key, chip.value)}
          />
        </span>
      ))}

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
          onPageChange={(e) => setPastPage(e.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="mt-4 flex items-center justify-center gap-2"
          pageClassName="pagination"
          activeClassName="bg-gray-200 font-semibold"
          previousClassName="pagination"
          nextClassName="pagination"
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
