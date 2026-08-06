import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { HiOutlineVideoCamera } from "react-icons/hi";
import { useLesson } from "../../../admin/lessons/hooks/useLesson";
import { useLessons } from "../../../admin/lessons/hooks/useLessons";
import ConfirmModal from "../../../../ui/ConfirmModal";
import Badge from "../../../../ui/Badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LessonDetailsHeader from "../../../admin/lessons/components/LessonDetailsHeader";
import { useAuth } from "../../../../contexts/AuthContext";
import StudentLessonDetailsHeader from "../../../student/lessons/components/StudentLessonDetailsHeader";
import UpsertLessonNoteModal from "../../../student/lessons/components/UpsertLessonNote";
import CompleteLessonModal from "../../../admin/lessons/components/CompleteLessonModal";
import UpsertLessonModal from "../../../admin/lessons/components/UpsertLessonModal";

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const { lesson, isLoading } = useLesson(id!);
  const { deleteLesson, isDeleting } = useLessons({
    onDeleteSuccess: () => navigate("/admin/lessons"),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  const actualMinutes = lesson.meeting_duration_in_seconds
    ? Math.round(lesson.meeting_duration_in_seconds / 60)
    : null;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <MdOutlineKeyboardBackspace size={16} /> Back to Lessons
        </button>
      </section>

      {/* Header */}
      {authUser?.role === "admin" ? (
        <LessonDetailsHeader
          lesson={lesson}
          setEditOpen={setEditOpen}
          setDeleteOpen={setDeleteOpen}
        />
      ) : (
        <StudentLessonDetailsHeader lesson={lesson} setAddOpen={setAddOpen} />
      )}

      {/* Recording */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {lesson.status === "completed" && lesson.recording_url ? (
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
              {lesson.teacher_note ? (
                <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                  {lesson.teacher_note}
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

      {authUser?.role === "student" && (
        <div className="panel-box">
          <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
            My note
          </p>
          {lesson.student_note ? (
            <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
              {lesson.student_note}
            </p>
          ) : (
            <p className="text-sm text-gray-300 italic">No note added.</p>
          )}
        </div>
      )}

      {/* Modals */}

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete lesson"
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        isSubmitting={isDeleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteLesson(lesson.id)}
      />

      {editOpen && lesson.status === "completed" ? (
        <CompleteLessonModal
          isOpen
          onClose={() => setEditOpen(false)}
          lessonId={lesson.id}
          durationInSeconds={lesson.meeting_duration_in_seconds!}
        />
      ) : (
        <UpsertLessonModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          type="Edit"
          lesson={lesson}
          timezone={authUser?.timezone}
        />
      )}

      {addOpen && (
        <UpsertLessonNoteModal
          isOpen
          onClose={() => setAddOpen(false)}
          lessonId={lesson.id}
        />
      )}
    </div>
  );
}
