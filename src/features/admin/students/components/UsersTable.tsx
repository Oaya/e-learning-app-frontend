import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";

import type { LanguageLevel, User, UserSort } from "@/type/user";
import SortButton from "@/ui/SortButton";
import defaultAvatar from "@/assets/user.png";

function formatLanguages(languageLevels?: LanguageLevel[]) {
  if (!languageLevels || languageLevels.length === 0) return "—";
  return languageLevels
    .map((l) => (l.level ? `${l.language} (${l.level})` : l.language))
    .join(", ");
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    invited: "bg-yellow-50 text-yellow-700",
    inactive: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${styles[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status || "—"}
    </span>
  );
}

export default function UsersTable({
  users,
  sorts,
  onToggleSort,
}: {
  users: User[];
  sorts: UserSort[];
  onToggleSort: (field: string) => void;
}) {
  function getSortValue(field: UserSort["field"]) {
    return sorts.find((s) => s.field === field)?.dir;
  }

  if (users.length === 0) {
    return (
      <p className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-400">
        No students found.
      </p>
    );
  }

  return (
    <div>
      {/* - Mobile card list (hidden on sm+) - */}
      <div className="flex flex-col gap-2 xl:hidden">
        {users.map((u) => (
          <Link
            key={u.id}
            to={`/users/${u.id}`}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300"
          >
            <img
              src={u.avatar || defaultAvatar}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">
                {u.first_name} {u.last_name}
              </p>
              <p className="truncate text-xs text-gray-400">{u.email}</p>
              <p className="truncate text-xs text-gray-400">
                {formatLanguages(u.language_levels)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={u.status ?? ""} />
              <HiOutlineChevronRight size={15} className="text-gray-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* - Desktop table (hidden on mobile) - */}
      <div className="hidden overflow-x-auto rounded border border-gray-200 bg-white xl:block">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="bg-theme-purple-10/20 text-left">
              <th className="w-[15%] p-2">
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
              <th className="w-[25%] p-2">
                <div className="flex items-center">
                  Email
                  <button type="button" onClick={() => onToggleSort("email")}>
                    <SortButton sort={getSortValue("email")} />
                  </button>
                </div>
              </th>
              <th className="w-[50%] p-2">
                <div className="flex items-center">Languages</div>
              </th>
              <th className="w-[15%] p-2">
                <div className="flex items-center">Rate</div>
              </th>
              <th className="w-[10%] p-2">
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
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-2">
                  <Link
                    to={`/users/${u.id}`}
                    className="flex min-w-0 items-center gap-2 text-blue-600 hover:underline"
                  >
                    <img
                      src={u.avatar || defaultAvatar}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate">
                      {u.first_name} {u.last_name}
                    </span>
                  </Link>
                </td>
                <td className="truncate p-2 text-gray-600" title={u.email}>
                  {u.email}
                </td>
                <td
                  className="truncate p-2 text-gray-600"
                  title={formatLanguages(u.language_levels)}
                >
                  {formatLanguages(u.language_levels)}
                </td>
                <td className="truncate p-2 text-gray-600" title="rate">
                  {u.lesson_rate != null
                    ? Number(u.lesson_rate).toFixed(2)
                    : ""}{" "}
                  {u.currency}
                </td>
                <td className="p-2 text-gray-600 capitalize">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
