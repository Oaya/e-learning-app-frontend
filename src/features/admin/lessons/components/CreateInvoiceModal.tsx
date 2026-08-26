import { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "@/utils/formData";
import CustomSelect from "@/ui/CustomSelect";
import type { Lesson } from "@/type/lesson";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import type { InvoiceStatusType } from "@/type/invoice";
import { currencies, invoiceStatus } from "@/utils/constants";
import { useInvoices } from "../hooks/useInvoices";
import defaultAvatar from "@/assets/user.png";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "Create" | "Edit";
  lesson?: Lesson;
};

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  type,
  lesson,
}: ModalProps) {
  const { createInvoice, isCreating } = useInvoices(lesson?.id);

  const isPrefilledFromFee =
    lesson?.cancellation_fee_amount != null &&
    lesson.cancellation_fee_amount > 0;

  const [currency, setCurrency] = useState<string>(
    lesson?.cancellation_fee_currency ?? lesson?.student.currency ?? "USD",
  );
  const [amount, setAmount] = useState<number>(
    lesson?.cancellation_fee_amount ?? lesson?.student.lesson_rate ?? 0,
  );
  const [status, setStatus] = useState<InvoiceStatusType>("unpaid");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!lesson) return;

    const formData = new FormData(e.currentTarget);

    try {
      await createInvoice({
        lesson_id: lesson.id,
        amount,
        currency,
        status,
        due_date: fdString(formData, "due_date") || undefined,
        notes: fdString(formData, "notes") || undefined,
      });
      onClose();
    } catch {
      // handled by mutation onError
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === "Create" ? "Create" : "Edit"} invoice`}
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

        {/* Amount + Currency */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Amount">
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                if (!isNaN(val)) setAmount(val);
              }}
              className="form-input"
            />
          </FormField>

          <FormField label="Currency">
            <CustomSelect
              className="capitalize"
              required
              menuPlacement="auto"
              value={{ value: currency, label: currency }}
              options={currencies.map((c) => ({ value: c, label: c }))}
              onChange={(selected: any) =>
                setCurrency(selected ? selected.value : "USD")
              }
            />
          </FormField>
        </div>

        {/* Due date + Status */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Due date">
            <input
              type="date"
              name="due_date"
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Status">
            <CustomSelect
              name="status"
              className="capitalize"
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
            placeholder="e.g. No show without notice"
            className="form-textarea"
          />
        </FormField>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="btn-primary-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary-pink"
          >
            {isCreating
              ? type === "Edit"
                ? "Saving..."
                : "Creating..."
              : type === "Edit"
                ? "Save changes"
                : "Create invoice"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
