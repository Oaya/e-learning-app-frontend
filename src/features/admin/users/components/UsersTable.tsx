import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";

import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useAuth } from "../../../../contexts/AuthContext";
import { capitalize } from "../../../../utils/helper";
import type { User, UserSort } from "../../../../type/user";
import SortButton from "../../../../components/ui/SortButton";

export default function UsersTable({
  users,
  sorts,
  selectedUser,
  onToggleSort,
}: {
  users: User[];
  sorts: UserSort[];
  selectedUser: Set<string>;
  onToggleSort: (field: string) => void;
}) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = users.length > 0 && selected.size === users.length - 1; // Exclude current user;

  const isAdmin = user?.role === "admin";
  const currentUserId = user?.id;
  const isSelf = (id: string) => id === currentUserId;

  function toggleAll() {
    const ids = users.filter((u) => u.id !== currentUserId).map((u) => u.id);

    const allSelected = ids.length > 0 && selected.size === ids.length;

    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function getSortValue(field: UserSort["field"]) {
    return sorts.find((s) => s.field === field)?.dir;
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
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

              <th className="p-3">
                <div className="flex items-center">
                  Name
                  <button
                    type="button"
                    onClick={() => onToggleSort("first_name")}
                  >
                    <SortButton sort={getSortValue("first_name")} />
                  </button>
                </div>
              </th>

              <th className="p-3">
                <div className="flex items-center">
                  Email
                  <button type="button" onClick={() => onToggleSort("email")}>
                    <SortButton sort={getSortValue("email")} />
                  </button>
                </div>
              </th>

              <th className="p-3">
                <div className="flex items-center">
                  Role
                  <button type="button" onClick={() => onToggleSort("role")}>
                    <SortButton sort={getSortValue("role")} />
                  </button>
                </div>
              </th>

              {isAdmin && (
                <th className="p-3">
                  <div className="flex items-center">
                    Status
                    <button
                      type="button"
                      onClick={() => onToggleSort("status")}
                    >
                      <SortButton sort={getSortValue("status")} />
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
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
