import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";
import { LuLanguages, LuExternalLink } from "react-icons/lu";
import { HiOutlineVideoCamera } from "react-icons/hi";

import { useLesson } from "../hooks/useLesson";
import { useLessons } from "../hooks/useLessons";
import UpsertLessonModal from "../components/UpsertLessonModal";
import LessonCompleteModal from "../../../shared/lessons/components/LessonCompleteModal";
import ConfirmModal from "../../../../ui/ConfirmModal";
import Badge from "../../../../ui/badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import { initials, formatTime } from "../../../../utils/helper";
import { MdMessage, MdOutlineKeyboardBackspace } from "react-icons/md";

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { lesson, isLoading } = useLesson(id!);
  const { deleteLesson, isDeleting } = useLessons({
    onDeleteSuccess: () => navigate("/admin/lessons"),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Lesson not found.</p>
      </div>
    );
  }

  const scheduledAt = dayjs(lesson.scheduled_at);
  const actualMinutes = lesson.meeting_duration_in_seconds
    ? Math.round(lesson.meeting_duration_in_seconds / 60)
    : null;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/lessons")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <MdOutlineKeyboardBackspace size={16} /> Back to Lessons
        </button>
      </section>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Title + student chip */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">
              {lesson.topic}
            </h1>
            <Link
              to={`/users/${lesson.student.id}`}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pr-3 pl-1 text-xs font-medium text-gray-700 hover:border-gray-300"
            >
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                {lesson.student.avatar ? (
                  <img
                    src={lesson.student.avatar}
                    alt="avatar"
                    className="h-5 w-5 rounded-full object-cover group-hover:opacity-80"
                  />
                ) : (
                  <span className="bg-theme-pink-10 text-theme-pink-20 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
                    {initials(
                      lesson.student.first_name,
                      lesson.student.last_name,
                    )}
                  </span>
                )}
                {lesson.student.first_name} {lesson.student.last_name}
              </span>

              <LuExternalLink size={11} className="text-gray-400" />
            </Link>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <HiOutlineCalendar size={15} />
              {scheduledAt.format("ddd, D MMM YYYY")}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <HiOutlineClock size={15} />
              {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes}{" "}
              min
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <LuLanguages size={15} />
              {lesson.language}
            </span>
            <Badge
              status={lesson.status}
              constant={LESSON_STATUS_BADGE}
              className="px-2 py-0.5"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="btn-white flex items-center gap-1.5 px-3 py-1.5"
          >
            <HiOutlinePencil size={15} />
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="btn-primary-pink"
          >
            <HiOutlineTrash size={15} />
            Delete
          </button>
        </div>
      </div>

      {/* Recording */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {lesson.recording_url ? (
          <video
            src={lesson.recording_url}
            controls
            className="w-full bg-black"
            style={{ maxHeight: 620 }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <HiOutlineVideoCamera size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">
              No recording for this lesson.
            </p>
            {lesson.status === "completed" && (
              <button
                onClick={() => setCompleteOpen(true)}
                className="btn-white mt-1 px-3 py-1.5 text-xs"
              >
                Add recording
              </button>
            )}
          </div>
        )}
      </div>

      {/* Details + Notes */}
      <div className="grid grid-cols-5 gap-4">
        {/* Details */}
        <div className="panel-box col-span-2">
          <p className="panel-header mb-4">Details</p>
          <div className="divide-y divide-gray-100 text-sm">
            <div className="flex justify-between py-2.5">
              <span className="text-gray-400">Scheduled duration</span>
              <span className="font-medium text-gray-800">
                {lesson.duration_in_minutes} min
              </span>
            </div>
            {actualMinutes !== null && (
              <div className="flex justify-between py-2.5">
                <span className="text-gray-400">Actual duration</span>
                <span className="font-medium text-gray-800">
                  {actualMinutes} min
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400">Status</span>
              <Badge
                status={lesson.status}
                constant={LESSON_STATUS_BADGE}
                className="px-2 py-0.5 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="panel-box col-span-3">
          <p className="panel-header mb-4">Notes</p>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Lesson note
              </p>
              {lesson.note ? (
                <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                  {lesson.note}
                </p>
              ) : (
                <p className="text-sm text-gray-300 italic">No note added.</p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Meeting feedback
              </p>
              {lesson.meeting_feedback ? (
                <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                  {lesson.meeting_feedback}
                </p>
              ) : (
                <p className="text-sm text-gray-300 italic">
                  No feedback added.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpsertLessonModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        type="Edit"
        lesson={lesson}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete lesson"
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        isSubmitting={isDeleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteLesson(lesson.id)}
      />

      {completeOpen && (
        <LessonCompleteModal
          isOpen
          onClose={() => setCompleteOpen(false)}
          lessonId={lesson.id}
          durationInSeconds={0}
        />
      )}
    </div>
  );
}
