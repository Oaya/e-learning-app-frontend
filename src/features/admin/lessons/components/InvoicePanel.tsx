import {
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineArrowUturnLeft,
} from "react-icons/hi2";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import dayjs from "dayjs";

import type { Lesson } from "@/type/lesson";
import { useInvoices } from "../hooks/useInvoices";

import type { Invoice } from "@/type/invoice";
import Badge from "@/ui/Badge";
import { INVOICE_STATUS_BADGE } from "@/utils/constants";

type Props = {
  lesson: Lesson;
  invoice: Invoice | undefined;
  setInvoiceModalOpen: (open: string) => void;
};

export default function InvoicePanel({ invoice, setInvoiceModalOpen }: Props) {
  const { updateInvoice, deleteInvoice, isUpdating, isDeleting } =
    useInvoices();

  async function handleMarkPaid() {
    if (!invoice) return;
    await updateInvoice({
      id: invoice.id,
      data: { status: "paid", paid_at: new Date().toISOString() },
    });
  }

  async function handleDelete() {
    if (!invoice) return;
    await deleteInvoice(invoice.id);
  }

  return (
    <>
      <div className="panel-box">
        <p className="panel-header">Invoice</p>

        {!invoice ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <LiaFileInvoiceDollarSolid size={28} className="text-gray-300" />
            <p className="no-content">No invoice for this lesson.</p>
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {invoice.currency} {Number(invoice.amount).toFixed(2)}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {invoice.status === "paid" && invoice.paid_at
                    ? `Paid: ${dayjs(invoice.paid_at).format("YYYY-MM-DD")}`
                    : invoice.due_date
                      ? `Due: ${dayjs(invoice.due_date).format("YYYY-MM-DD")}`
                      : "No due date"}
                </p>
                {invoice.notes && (
                  <p className="mt-2 text-xs text-gray-500">{invoice.notes}</p>
                )}
              </div>

              <Badge status={invoice.status} constant={INVOICE_STATUS_BADGE} />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setInvoiceModalOpen("Edit")}
                className="btn-white px-3 py-1.5 text-xs font-medium"
              >
                <HiOutlinePencil size={13} />
                Edit note
              </button>
              {invoice.status === "unpaid" ? (
                <button
                  onClick={handleMarkPaid}
                  disabled={isUpdating}
                  className="btn-primary px-3 py-1.5 text-xs font-medium"
                >
                  <HiOutlineCheck size={13} />
                  Mark as paid
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateInvoice({
                      id: invoice.id,
                      data: { status: "unpaid", paid_at: null },
                    })
                  }
                  disabled={isUpdating}
                  className="btn-white px-3 py-1.5 text-xs font-medium"
                >
                  <HiOutlineArrowUturnLeft size={13} />
                  Mark as unpaid
                </button>
              )}
              {invoice.status === "unpaid" && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-primary-pink px-3 py-1.5 text-xs font-medium"
                >
                  <HiOutlineTrash size={13} />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
