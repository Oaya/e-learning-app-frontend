import { Link } from "react-router-dom";
import {
  HiOutlineCheck,
  HiOutlineChevronRight,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArrowUturnLeft,
  HiOutlineEye,
} from "react-icons/hi2";

import defaultAvatar from "@/assets/user.png";
import type { Invoice } from "@/type/invoice";
import dayjs from "dayjs";
import { useInvoices } from "../../lessons/hooks/useInvoices";
import ActionBtn from "@/ui/ActionButton";
import UpsertInvoiceModal from "../../lessons/components/UpsertInvoiceModal";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Badge from "@/ui/Badge";
import { INVOICE_STATUS_BADGE } from "@/utils/constants";

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [editInvoiceOpen, setEditInvoiceOpen] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { updateInvoice, deleteInvoice, isUpdating, isDeleting } =
    useInvoices();
  const { user: authUser } = useAuth();

  const canTrackInvoice =
    authUser?.role === "admin" && authUser?.has_pro_access;

  function handleCloseEditInvoice() {
    setEditInvoiceOpen("");
    setEditingInvoice(null);
  }

  if (invoices.length === 0) {
    return (
      <p className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-400">
        No payment found.
      </p>
    );
  }

  async function handleMarkPaid(id: string) {
    await updateInvoice({
      id: id,
      data: { status: "paid", paid_at: new Date().toISOString() },
    });
  }

  async function handleDelete(id: string) {
    await deleteInvoice(id);
  }

  return (
    <div>
      {/* - Mobile card list (hidden on sm+) - */}
      <div className="flex flex-col gap-2 xl:hidden">
        {invoices.map((i) => (
          <Link
            key={i.id}
            to={`/admin/lessons/${i.lesson.id}`}
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
              <p className="truncate text-xs text-gray-400">
                {Number(i.amount).toFixed(2)} {i.currency}
              </p>
              <p className="truncate text-xs text-gray-400">
                {i.lesson.topic} · Due :{dayjs(i.due_date).format("YYYY-MM-DD")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                status={i.status}
                constant={INVOICE_STATUS_BADGE}
                className="px-2 py-0.5 text-xs"
              />

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
              <th className="p-2">
                <div className="flex items-center">Student</div>
              </th>
              <th className="p-2">
                <div className="flex items-center">Lesson</div>
              </th>
              <th className="p-2">
                <div className="flex items-center">Amount</div>
              </th>
              <th className="p-2">
                <div className="flex items-center">Status</div>
              </th>
              <th className="p-2">
                <div className="flex items-center">Due Date</div>
              </th>
              <th className="p-2">
                <div className="flex items-center">Paid Date</div>
              </th>
              <th className="p-2">
                <div className="flex items-center" />
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
                    to={`/users/${i.student.id}`}
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
                <td className="p-2 text-gray-600 capitalize" title="status">
                  {i.status}
                </td>
                <td className="p-2 text-gray-600 capitalize">
                  <p> {dayjs(i.due_date).format("YYYY-MM-DD")}</p>

                  {i.status === "unpaid" &&
                    dayjs(i.due_date).isBefore(dayjs(), "day") && (
                      <p className="text-[11px] font-semibold text-red-500">
                        Past Due Date
                      </p>
                    )}
                </td>
                <td className="p-2 text-gray-600 capitalize">
                  {i.paid_at ? dayjs(i.paid_at).format("YYYY-MM-DD") : "—"}
                </td>

                <td className="p-2 text-gray-600 capitalize">
                  <div
                    className="flex shrink-0 items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {i.status === "unpaid" ? (
                      <ActionBtn
                        onClick={() => handleMarkPaid(i.id)}
                        title="Mark as paid"
                        disabled={isUpdating}
                      >
                        <HiOutlineCheck size={15} className="font-semibold" />
                      </ActionBtn>
                    ) : (
                      <ActionBtn
                        onClick={() =>
                          updateInvoice({
                            id: i.id,
                            data: { status: "unpaid", paid_at: null },
                          })
                        }
                        title="Mark as unpaid"
                        disabled={isUpdating}
                      >
                        <HiOutlineArrowUturnLeft size={15} />
                      </ActionBtn>
                    )}
                    <ActionBtn
                      title="Edit note"
                      onClick={() => {
                        setEditingInvoice(i);
                        setEditInvoiceOpen("Edit");
                      }}
                    >
                      <HiOutlinePencil size={15} />
                    </ActionBtn>
                    <Link to={`/admin/lessons/${i.lesson.id}`}>
                      <ActionBtn title="View lesson">
                        <HiOutlineEye size={15} />
                      </ActionBtn>
                    </Link>
                    {i.status === "unpaid" && (
                      <ActionBtn
                        title="Delete"
                        disabled={isDeleting}
                        onClick={() => handleDelete(i.id)}
                      >
                        <HiOutlineTrash size={15} />
                      </ActionBtn>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editInvoiceOpen && canTrackInvoice && (
        <UpsertInvoiceModal
          isOpen={editInvoiceOpen}
          onClose={handleCloseEditInvoice}
          invoice={editingInvoice ?? undefined}
        />
      )}
    </div>
  );
}
