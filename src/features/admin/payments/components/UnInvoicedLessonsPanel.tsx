import { useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import dayjs from "dayjs";

import { useLessons } from "@/features/admin/lessons/hooks/useLessons";
import UpsertInvoiceModal from "@/features/admin/lessons/components/UpsertInvoiceModal";
import defaultAvatar from "@/assets/user.png";
import type { Lesson } from "@/type/lesson";
import { LESSON_STATUS_BADGE } from "@/utils/constants";
import Badge from "@/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";

export default function UnInvoicedLessonsPanel() {
  const { lessons = [] } = useLessons();
  const { user: authUser } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const uninvoiced = useMemo(() => {
    return lessons.filter((lesson) => {
      if (lesson.invoice_id) return false;

      const hasFee =
        lesson.cancellation_fee_amount != null &&
        lesson.cancellation_fee_amount > 0;

      return (
        lesson.status === "completed" ||
        lesson.status === "scheduled" ||
        ((lesson.status === "canceled" || lesson.status === "no_show") &&
          hasFee)
      );
    });
  }, [lessons]);

  if (uninvoiced.length === 0) return null;

  return (
    <>
      <div className="panel-box">
        <div className="mb-3 flex items-center justify-between">
          <p className="panel-header mb-0 flex items-center gap-2">
            Lessons needing an invoice
            <span className="text-theme-yellow-20 bg-theme-yellow-10 rounded-full px-2 py-0.5 text-xs font-medium">
              {uninvoiced.length}
            </span>
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {uninvoiced.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between py-2.5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={lesson.student.avatar || defaultAvatar}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-800">{lesson.topic}</p>
                  <p className="text-xs text-gray-400">
                    {lesson.student.first_name} {lesson.student.last_name} ·{" "}
                    {dayjs(lesson.scheduled_at).format("YYYY-MM-DD")}
                  </p>
                </div>
                <Badge
                  status={lesson.status}
                  constant={LESSON_STATUS_BADGE}
                  className="px-2 py-0.5 text-xs"
                />
              </div>

              <div className="shrink-0 items-center md:flex md:gap-3">
                <span className="block text-center text-sm font-medium text-gray-600">
                  {lesson.student.lesson_rate} {authUser?.currency}
                </span>
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className="btn-white flex items-center gap-1 px-3 py-1.5 text-xs"
                >
                  <HiOutlinePlus size={13} />
                  Create
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedLesson && (
        <UpsertInvoiceModal
          isOpen="Create"
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
        />
      )}
    </>
  );
}
