import { Link } from "react-router-dom";
import { IoIosCheckbox } from "react-icons/io";

import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { capitalize } from "../../../../utils/helper";
import type { User, UserSort } from "../../../../type/user";
import SortButton from "../../../../ui/SortButton";
import { UserModel } from "../../../../models/user";

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
  function getSortValue(field: UserSort["field"]) {
    return sorts.find((s) => s.field === field)?.dir;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-theme-purple-10/20 text-left">
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
                  Status
                  <button type="button" onClick={() => onToggleSort("status")}>
                    <SortButton sort={getSortValue("status")} />
                  </button>
                </div>
              </th>
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
                  <td className="p-3">
                    {selected.has(u.id) ? (
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

                  <td className="p-3">
                    <Link
                      to={`/users/${u.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {new UserModel(u).fullName()}
                    </Link>
                  </td>

                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{capitalize(u.status) ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
