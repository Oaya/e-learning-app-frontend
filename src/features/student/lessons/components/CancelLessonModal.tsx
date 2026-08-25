import dayjs from "dayjs";
import type { Lesson } from "@/type/lesson";

import { useAuth } from "@/contexts/AuthContext";
import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import ModalShell from "@/ui/ModalShell";

type Props = {
  isOpen: boolean;
  lesson: Lesson;
  onCancel: () => void;
};

function formatFeePercent(pct: number) {
  if (pct === 0) return "No charge";
  return `${pct}% of lesson rate`;
}

function formatWindow(hours: number) {
  if (hours === 0) return null;
  if (hours < 24) return `${hours} hours`;
  return `${hours / 24} day${hours / 24 > 1 ? "s" : ""}`;
}

export default function CancelLessonModal({ isOpen, lesson, onCancel }: Props) {
  const { user: student } = useAuth();
  const { cancelLesson, isCancelling } = useLesson(lesson.id);

  if (!isOpen) return null;

  const {
    no_show_fee_percent,
    late_cancellation_fee_percent,
    cancellation_window_hours,
  } = lesson.admin;

  const hoursUntilLesson = dayjs(lesson.scheduled_at).diff(
    dayjs(),
    "hour",
    true,
  );
  const isLate =
    cancellation_window_hours > 0 &&
    hoursUntilLesson < cancellation_window_hours;

  const applicableFeePercent = isLate ? late_cancellation_fee_percent : 0;
  const lessonRate = student?.lesson_rate ?? 0;
  const currency = student?.currency ?? "USD";
  const feeAmount = lessonRate * (applicableFeePercent / 100);

  const windowLabel = formatWindow(cancellation_window_hours);

  async function handleConfirm() {
    try {
      await cancelLesson(lesson.id);
      onCancel();
    } catch {
      // error toast already surfaced by useLesson
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onCancel}
      title="Cancel lesson"
      subtitle={lesson.topic}
      maxWidth="max-w-lg"
    >
      <div className="modal-body">
        {/* Policy summary */}
        <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
          {cancellation_window_hours === 0 ? (
            <p className="text-gray-600">
              Your teacher has no cancellation policy. You can cancel freely.
            </p>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Cancellation window</span>
                <span className="font-medium text-gray-800">
                  {windowLabel} before lesson
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Late cancellation fee</span>
                <span className="font-medium text-gray-800">
                  {formatFeePercent(late_cancellation_fee_percent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">No-show fee</span>
                <span className="font-medium text-gray-800">
                  {formatFeePercent(no_show_fee_percent)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Fee warning */}
        {isLate && applicableFeePercent > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Late cancellation</p>
            <p className="mt-0.5 text-amber-700">
              This lesson starts in less than {windowLabel}. A fee of{" "}
              <span className="font-semibold">
                {feeAmount > 0
                  ? `${currency} ${feeAmount.toFixed(2)}`
                  : `${applicableFeePercent}%`}
              </span>{" "}
              may apply.
            </p>
          </div>
        )}

        {!isLate && cancellation_window_hours > 0 && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <p className="font-medium">Free cancellation</p>
            <p className="mt-0.5 text-green-700">
              You're cancelling more than {windowLabel} in advance - no fee
              applies.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            className="btn-primary-white"
          >
            Keep lesson
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCancelling}
            className="btn-primary-pink"
          >
            {isCancelling ? "Cancelling…" : "Cancel lesson"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
