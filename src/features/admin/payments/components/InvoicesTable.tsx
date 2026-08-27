import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";

import defaultAvatar from "@/assets/user.png";
import type { Invoice } from "@/type/invoice";
import dayjs from "dayjs";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-50 text-green-700",
    unpaid: "bg-yellow-50 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${styles[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status || "—"}
    </span>
  );
}

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <p className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-400">
        No payment found.
      </p>
    );
  }

  return (
    <div>
      {/* - Mobile card list (hidden on sm+) - */}
      <div className="flex flex-col gap-2 xl:hidden">
        {invoices.map((i) => (
          <Link
            key={i.id}
            to={`/users/${i.id}`}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300"
          >
            <img
              src={i.student.avatar || defaultAvatar}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">
                {i.student.first_name} {i.student.last_name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={i.status ?? ""} />
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
                <div className="flex items-center">Student</div>
              </th>
              <th className="w-[25%] p-2">
                <div className="flex items-center">Lesson</div>
              </th>
              <th className="w-[20%] p-2">
                <div className="flex items-center">Amount</div>
              </th>
              <th className="w-[10%] p-2">
                <div className="flex items-center">Status</div>
              </th>
              <th className="w-[20%] p-2">
                <div className="flex items-center">Due Date</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr
                key={i.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-2">
                  <Link
                    to={`/users/${i.id}`}
                    className="flex min-w-0 items-center gap-2 text-blue-600 hover:underline"
                  >
                    <img
                      src={i.student.avatar || defaultAvatar}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate">
                      {i.student.first_name} {i.student.last_name}
                    </span>
                  </Link>
                </td>
                <td className="truncate p-2 text-gray-600" title="lesson">
                  <p> {i.lesson.topic} </p>
                  <p className="text-[11px]">
                    {dayjs(i.lesson.scheduled_at).format("YYYY-MM-DD")} ·
                    {i.lesson.duration_in_minutes} min
                  </p>
                </td>
                <td className="truncate p-2 text-gray-600" title="amount">
                  {Number(i.amount).toFixed(2)} {i.currency}
                </td>
                <td
                  className="truncate p-2 text-gray-600 capitalize"
                  title="status"
                >
                  {i.status}
                </td>
                <td className="p-2 text-gray-600 capitalize">
                  {" "}
                  {dayjs(i.due_date).format("YYYY-MM-DD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
