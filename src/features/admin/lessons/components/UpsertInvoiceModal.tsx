import { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "@/utils/formData";
import CustomSelect from "@/ui/CustomSelect";
import type { Lesson } from "@/type/lesson";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import type { Invoice, InvoiceStatusType } from "@/type/invoice";
import { invoiceStatus } from "@/utils/constants";
import { useInvoices } from "../hooks/useInvoices";
import { useAuth } from "@/contexts/AuthContext";
import defaultAvatar from "@/assets/user.png";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: string;
  onClose: () => void;
  lesson?: Lesson;
  invoice?: Invoice;
};

export default function UpsertInvoiceModal({
  isOpen,
  onClose,
  lesson,
  invoice,
}: ModalProps) {
  const isEdit = isOpen === "Edit" && !!invoice;

  const { user } = useAuth();
  const { createInvoice, updateInvoice, isCreating, isUpdating } =
    useInvoices();

  const isPrefilledFromFee =
    !isEdit &&
    lesson?.cancellation_fee_amount != null &&
    lesson.cancellation_fee_amount > 0;

  const currency = user?.currency ?? "USD";
  const [amount, setAmount] = useState<number | "">(
    invoice?.amount ??
      lesson?.cancellation_fee_amount ??
      lesson?.student.lesson_rate ??
      0,
  );
  const [status, setStatus] = useState<InvoiceStatusType>(
    invoice?.status ?? "unpaid",
  );

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const numericAmount = Number(amount) || 0;

    try {
      const paid_at = status === "paid" ? new Date().toISOString() : null;

      if (isEdit && invoice) {
        await updateInvoice({
          id: invoice.id,
          data: {
            amount: numericAmount,
            status,
            due_date: fdString(formData, "due_date") || undefined,
            notes: fdString(formData, "notes") || undefined,
            paid_at: paid_at,
          },
        });
      } else if (lesson) {
        await createInvoice({
          lesson_id: lesson.id,
          amount: numericAmount,
          status,
          due_date: fdString(formData, "due_date") || undefined,
          notes: fdString(formData, "notes") || undefined,
          paid_at: paid_at,
        });
      } else {
        return;
      }
      onClose();
    } catch {
      // handled by mutation onError
    }
  }

  const isLoading = isCreating || isUpdating;
  const isPaid = isEdit && invoice?.status === "paid";

  return (
    <ModalShell
      isOpen={!!isOpen}
      onClose={onClose}
      title={`${isEdit ? "Edit" : "Create"} invoice`}
      subtitle={lesson?.topic}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="modal-body">
        {/* Pre-fill notice */}
        {isPrefilledFromFee && (
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            <HiOutlineInformationCircle size={16} className="mt-0.5 shrink-0" />
            <p>
              Pre-filled from{" "}
              {lesson?.status === "no_show" ? "no-show" : "late cancellation"}{" "}
              fee. You can edit the amount before saving.
            </p>
          </div>
        )}

        {/* Student (read-only) */}
        {lesson && (
          <FormField label="Student">
            <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
              <img
                src={lesson.student.avatar || defaultAvatar}
                alt="avatar"
                className="h-7 w-7 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {lesson.student.first_name} {lesson.student.last_name}
                </p>
                <p className="text-xs text-gray-400">{lesson.student.email}</p>
              </div>
            </div>
          </FormField>
        )}

        {/* Paid notice */}
        {isPaid && (
          <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
            <HiOutlineInformationCircle size={16} className="mt-0.5 shrink-0" />
            <p>This invoice is paid. Only the note can be edited.</p>
          </div>
        )}

        {/* Amount + Currency */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Amount">
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              disabled={isPaid}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value === "" ? "" : e.target.valueAsNumber);
              }}
              className="form-input"
            />
          </FormField>

          <FormField label="Currency">
            <div className="form-input flex items-center bg-gray-50 text-gray-500">
              {currency}
            </div>
          </FormField>
        </div>

        {/* Due date + Status */}
        <div className="grid-cols-2 md:grid md:gap-3">
          <FormField label="Due date">
            <input
              type="date"
              name="due_date"
              disabled={isPaid}
              defaultValue={
                invoice?.due_date
                  ? dayjs(invoice.due_date).format("YYYY-MM-DD")
                  : undefined
              }
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Status">
            <CustomSelect
              name="status"
              className="capitalize"
              isDisabled={isPaid}
              value={{ value: status, label: status }}
              options={invoiceStatus.map((i) => ({ value: i, label: i }))}
              onChange={(selected: any) =>
                setStatus(selected ? selected.value : "unpaid")
              }
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField label="Notes" optional>
          <textarea
            name="notes"
            rows={2}
            defaultValue={invoice?.notes ?? ""}
            placeholder="e.g. No show without notice"
            className="form-textarea"
          />
        </FormField>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-primary-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-pink"
          >
            {isLoading
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save changes"
                : "Create invoice"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
