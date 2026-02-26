import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";

import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";
import { capitalize } from "../../../utils/helper";
import type { User } from "../../../type/user";

export default function UsersTable({ users }: { users: User[] }) {
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

              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>

              {isAdmin && <th className="p-3">Status</th>}
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
