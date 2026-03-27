import { Link } from "react-router-dom";
import { IoIosCheckbox } from "react-icons/io";

import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useAuth } from "../../../../contexts/AuthContext";
import { capitalize } from "../../../../utils/helper";
import type { User, UserSort } from "../../../../type/user";
import SortButton from "../../../../ui/SortButton";

export default function UsersTable({
  users,
  sorts,
  selected,
  allSelected,
  onToggleSort,
  onToggleOne,
  onToggleAll,
}: {
  users: User[];
  sorts: UserSort[];
  selected: Set<string>;
  allSelected: boolean;
  onToggleSort: (field: string) => void;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const isSelf = (id: string) => id === user?.id;

  function getSortValue(field: UserSort["field"]) {
    return sorts.find((s) => s.field === field)?.dir;
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
                      onClick={() => onToggleAll()}
                    />
                  ) : (
                    <MdOutlineCheckBoxOutlineBlank
                      size={18}
                      className="text-theme-purple-10 cursor-pointer"
                      onClick={() => onToggleAll()}
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
                          onClick={() => onToggleOne(u.id)}
                          size={18}
                        />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank
                          className="text-theme-purple-10 cursor-pointer"
                          onClick={() => onToggleOne(u.id)}
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
