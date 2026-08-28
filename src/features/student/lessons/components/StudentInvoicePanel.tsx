import dayjs from "dayjs";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { useInvoice } from "@/features/admin/lessons/hooks/useInvoice";
import { INVOICE_STATUS_BADGE } from "@/utils/constants";
import Badge from "@/ui/Badge";

type Props = {
  invoiceId: string;
};

export default function StudentInvoicePanel({ invoiceId }: Props) {
  const { invoice } = useInvoice(invoiceId);
  console.log(invoice);

  if (!invoice) return null;

  const isPaid = invoice.status === "paid";
  const isOverdue =
    !isPaid &&
    invoice.due_date &&
    dayjs(invoice.due_date).isBefore(dayjs(), "day");

  return (
    <div className="panel-box">
      <p className="panel-header mb-4">Invoice</p>

      {isOverdue && (
        <div className="mb-4 flex items-start gap-1.5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          <HiOutlineExclamationCircle size={18} className="mt-0.5 shrink-0" />
          <p>
            Payment was due on{" "}
            <span className="font-medium">
              {dayjs(invoice.due_date).format("YYYY-MM-DD")}
            </span>
            . Please contact your teacher.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
            Amount
          </p>
          <p className="text-sm font-medium text-gray-800">
            {invoice.currency ?? ""} {Number(invoice.amount ?? 0).toFixed(2)}
          </p>
        </div>

        {isPaid ? (
          <div>
            <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
              Paid at
            </p>
            <p className="text-sm font-medium text-gray-800">
              {invoice.paid_at
                ? dayjs(invoice.paid_at).format("YYYY-MM-DD")
                : "—"}
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
              Due date
            </p>
            <p
              className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-800"}`}
            >
              {invoice.due_date
                ? dayjs(invoice.due_date).format("YYYY-MM-DD")
                : "—"}
            </p>
          </div>
        )}

        <div>
          <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
            Status
          </p>
          <Badge status={invoice.status} constant={INVOICE_STATUS_BADGE} />
        </div>
      </div>

      {invoice.notes && (
        <>
          <div className="my-3 border-t border-gray-100" />
          <p className="mb-1.5 text-xs tracking-wide text-gray-400 uppercase">
            Note from teacher
          </p>
          <p className="rounded-lg text-sm text-gray-600">{invoice.notes}</p>
        </>
      )}
    </div>
  );
}
