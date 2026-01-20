import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useAlert } from "../../../contexts/AlertContext";
import { useUsers } from "../../../hooks/useUsers";
import InviteUserModal from "../../../components/ui/InviteUserModal";

export default function UsersPage() {
  const alert = useAlert();
  const { users, isLoading, isError, error } = useUsers();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isInviteOpen, setInviteOpen] = useState(false);

  const uData = users || [];

  const allSelected = uData.length > 0 && selected.size === uData.length;
  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(uData.map((u) => u.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500">
            {uData.length} total
          </span>

          <button className="btn-secondary" onClick={() => setInviteOpen(true)}>
            Invite User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-c-purple/20 text-left">
              <th className="w-10 p-3">
                {allSelected ? (
                  <IoIosCheckbox
                    size={18}
                    className="text-c-purple cursor-pointer"
                    onClick={toggleAll}
                  />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank
                    size={18}
                    className="text-c-purple cursor-pointer"
                    onClick={toggleAll}
                  />
                )}
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
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
                  <td className="p-3">
                    {selected.has(u.id) ? (
                      <IoIosCheckbox
                        className="text-c-purple cursor-pointer"
                        onClick={() => toggleOne(u.id)}
                        size={18}
                      />
                    ) : (
                      <MdOutlineCheckBoxOutlineBlank
                        className="text-c-purple cursor-pointer"
                        onClick={() => toggleOne(u.id)}
                        size={18}
                      />
                    )}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {u.first_name} {u.last_name}
                    </Link>
                  </td>

                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
