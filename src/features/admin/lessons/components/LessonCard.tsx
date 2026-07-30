import {
  HiOutlineVideoCamera,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";
import ActionBtn from "./ActionButton";
import type { Lesson } from "../../../../type/lesson";
import {
  capitalize,
  formatDay,
  formatTime,
  initials,
} from "../../../../utils/helper";
import {
  LESSON_BORDER_COLOR,
  LESSON_STATUS_BADGE,
} from "../../../../utils/constants";
import ConfirmModal from "../../../../ui/ConfirmModal";
import { useLessons } from "../hooks/useLessons";
import { useState } from "react";
import UpsertLessonModal from "./UpsertLessonModal";
import Badge from "../../../../ui/badge";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useNavigate } from "react-router-dom";
import { LuVideo } from "react-icons/lu";

dayjs.extend(isSameOrAfter);

type Props = {
  lesson: Lesson;
  allLessons?: Lesson[];
  timezone?: string;
};

export default function LessonCard({ lesson, allLessons, timezone }: Props) {
  const [targetLessonId, setTargetLessonId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"Delete" | "Cancel" | null>(
    null,
  );

  const [editLessonId, setEditLessonId] = useState<string | null>(null);

  const { isDeleting, isCanceling, deleteLesson, cancelLesson } = useLessons({
    onDeleteSuccess: () => setTargetLessonId(null),
    onCancelSuccess: () => setTargetLessonId(null),
  });

  const navigate = useNavigate();

  function handleModalActionChange(id: string, type: "Delete" | "Cancel") {
    setTargetLessonId(id);
    setActionType(type);
  }

  function handelCancelOrDelete() {
    if (!targetLessonId) return;

    if (actionType === "Delete") {
      deleteLesson(targetLessonId);
    } else {
      cancelLesson(targetLessonId);
    }
  }
  const { day, mon } = formatDay(lesson.scheduled_at);
  const isPast = lesson.status === "completed" || lesson.status === "canceled";
  const canJoinLesson = dayjs().isSameOrAfter(
    dayjs(lesson.scheduled_at).subtract(30, "minute"),
  );

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${LESSON_BORDER_COLOR[lesson.status]}`}
      style={{ opacity: lesson.status === "canceled" ? 0.7 : 1 }}
    >
      {/* Date block */}
      <div className="w-12 shrink-0 text-center">
        <div className="text-2xl leading-none font-semibold text-gray-800">
          {day}
        </div>
        <div className="text-[11px] tracking-wide text-gray-400 uppercase">
          {mon}
        </div>
      </div>

      {/* Divider */}
      <div className="h-14 w-px shrink-0 bg-gray-200" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">
          {lesson.topic}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineVideoCamera size={14} />
            {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            {lesson.student.avatar ? (
              <img
                src={lesson.student.avatar}
                alt="avatar"
                className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
              />
            ) : (
              <span className="bg-theme-pink-10 text-theme-pink-20 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold">
                {initials(lesson.student.first_name, lesson.student.last_name)}
              </span>
            )}
            {lesson.student.first_name} {lesson.student.last_name}
          </span>
          {/* {lesson.has_recording && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <HiOutlineVideoCamera size={14} /> Recording
            </span>
          )} */}
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          value={capitalize(lesson.status)}
          status={lesson.status}
          constant={LESSON_STATUS_BADGE}
          className="px-2 py-0.5"
        />
        {canJoinLesson && (
          <button
            onClick={() => navigate(`/lessons/${lesson.id}/meeting`)}
            className="btn-primary-pink mt-2 flex items-center gap-1 px-2"
          >
            <LuVideo size={16} />
            Join Lesson
          </button>
        )}

        {/* <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            lesson.payment_status === "paid"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {lesson.payment_status === "paid" ? "Paid" : "Unpaid"}
        </span> */}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isPast && (
          <>
            <ActionBtn title="Edit" onClick={() => setEditLessonId(lesson.id)}>
              <HiOutlinePencil size={16} />
            </ActionBtn>
            <ActionBtn
              title="Cancel lesson"
              onClick={() => handleModalActionChange(lesson.id, "Cancel")}
            >
              <HiOutlineX size={16} />
            </ActionBtn>
          </>
        )}
        {isPast && (
          <>
            {/* {lesson.has_recording && (
              <ActionBtn title="View recording">
                <HiOutlineVideoCamera size={16} />
              </ActionBtn>
            )} */}
            {lesson.status === "canceled" && (
              <ActionBtn
                title="Delete"
                onClick={() => handleModalActionChange(lesson.id, "Delete")}
              >
                <HiOutlineTrash size={16} />
              </ActionBtn>
            )}
          </>
        )}
      </div>

      {/* Delete & Cancel confirm */}
      <ConfirmModal
        isOpen={targetLessonId !== null}
        title={`${actionType} lesson`}
        isSubmitting={isDeleting || isCanceling}
        message={
          actionType === "Delete"
            ? "Are you sure you want to delete this? This action cannot be undone."
            : "Are you sure you want to cancel this lesson? "
        }
        onCancel={() => setTargetLessonId(null)}
        onConfirm={() => handelCancelOrDelete()}
      />

      {/* Edit Lesson */}
      <UpsertLessonModal
        isOpen={editLessonId !== null}
        onClose={() => setEditLessonId(null)}
        type="Edit"
        lesson={lesson}
        lessons={allLessons}
        timezone={timezone}
      />
    </div>
  );
}
