import {
  HiOutlineVideoCamera,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineClock,
} from "react-icons/hi";
import ActionBtn from "./ActionButton";
import type { Lesson, LessonStatusType } from "../../../../type/lesson";
import {
  canJoinLesson,
  formatDay,
  formatTime,
  initials,
  requireStatusChange,
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
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useNavigate } from "react-router-dom";
import { LuVideo } from "react-icons/lu";
import LessonCompleteModal from "./CompleteLessonModal";
import WatchRecordingModal from "../../../shared/lessons/components/WatchRecordingModal";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type Props = {
  lesson: Lesson;
  allLessons?: Lesson[];
  timezone?: string;
};

export default function LessonCard({ lesson, allLessons, timezone }: Props) {
  const { day, mon } = formatDay(lesson.scheduled_at);
  const navigate = useNavigate();
  const [editLessonId, setEditLessonId] = useState<string | null>(null);
  const [completeLessonId, setCompleteLessonId] = useState<string | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [watchingRecording, setWatchingRecording] = useState(false);
  const { isDeleting, deleteLesson } = useLessons({
    onDeleteSuccess: () => setDeleteLessonId(null),
  });

  function handleModalActionChange(id: string, status: LessonStatusType) {
    if (status === "completed") {
      setCompleteLessonId(id);
    } else {
      setEditLessonId(id);
    }
  }

  return (
    <div
      className={`card cursor-pointer ${LESSON_BORDER_COLOR[lesson.status]}`}
      style={{ opacity: lesson.status === "canceled" ? 0.5 : 1 }}
      onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
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
        <div className="flex gap-4">
          <p className="truncate text-sm font-medium text-gray-800">
            {lesson.topic}
          </p>
          {requireStatusChange(lesson) && (
            <p className="truncate text-sm font-medium text-red-400">
              This lesson is in the past but is still marked as scheduled.
              Update its status.
            </p>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineClock size={16} />
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
          {lesson.recording_url && (
            <span className="text-theme-green-20 flex items-center gap-1 text-xs">
              <HiOutlineVideoCamera size={14} /> Recording
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          status={lesson.status}
          constant={LESSON_STATUS_BADGE}
          className="px-2 py-0.5"
        />
        {canJoinLesson(lesson) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lessons/${lesson.id}/meeting`);
            }}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <LuVideo size={16} />
            Join Lesson
          </button>
        )}

        {lesson.recording_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWatchingRecording(true);
            }}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <LuVideo size={16} />
            Watch
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
      <div
        className="flex shrink-0 items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <ActionBtn
            title="Edit"
            onClick={() => handleModalActionChange(lesson.id, lesson.status)}
          >
            <HiOutlinePencil size={16} />
          </ActionBtn>
          <ActionBtn
            title="Delete"
            onClick={() => setDeleteLessonId(lesson.id)}
          >
            <HiOutlineTrash size={16} />
          </ActionBtn>
        </>
      </div>

      {/* Delete & Cancel confirm */}
      <ConfirmModal
        isOpen={deleteLessonId !== null}
        title="Delete Lessons"
        isSubmitting={isDeleting}
        message="Are you sure you want to delete this? This action cannot be undone."
        onCancel={() => setDeleteLessonId(null)}
        onConfirm={() => deleteLesson(lesson.id)}
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

      {completeLessonId && (
        <LessonCompleteModal
          isOpen
          onClose={() => setCompleteLessonId(null)}
          lessonId={lesson.id}
          durationInSeconds={lesson.meeting_duration_in_seconds ?? 0}
        />
      )}

      {watchingRecording && lesson.recording_url && (
        <WatchRecordingModal
          isOpen
          onClose={() => setWatchingRecording(false)}
          recordingUrl={lesson.recording_url}
        />
      )}
    </div>
  );
}
