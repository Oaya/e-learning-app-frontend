import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineVideoCamera } from "react-icons/hi2";

import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import { useLessons } from "@/features/admin/lessons/hooks/useLessons";
import ConfirmModal from "@/ui/ConfirmModal";
import {
  MdOutlineKeyboardBackspace,
  MdOutlineFreeCancellation,
} from "react-icons/md";
import LessonDetailsHeader from "@/features/admin/lessons/components/LessonDetailsHeader";
import { useAuth } from "@/contexts/AuthContext";
import StudentLessonDetailsHeader from "@/features/student/lessons/components/StudentLessonDetailsHeader";
import CompleteLessonModal from "@/features/admin/lessons/components/CompleteLessonModal";
import UpsertLessonModal from "@/features/admin/lessons/components/UpsertLessonModal";
import LessonNotesViewer from "@/features/shared/lessons/components/LessonNoteViewer";
import PageLoadingState from "@/ui/PageLoadingState";
import CancellationPolicyPanel from "../components/CancellationPolicyPanel";
import InlineStudentNote from "@/features/student/lessons/components/InlineStudentNote";

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const { lesson, isLoading } = useLesson(id!);
  const { deleteLesson, isDeleting } = useLessons({
    onDeleteSuccess: () => navigate("/admin/lessons"),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return <PageLoadingState message="Loading lesson..." />;
  }

  if (!lesson) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Lesson not found.</p>
      </div>
    );
  }

  const hasRecording = lesson.status === "completed" && !!lesson.recording_url;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <MdOutlineKeyboardBackspace size={16} />
          <span className="hidden sm:inline">Back to Lessons</span>
          <span className="sm:hidden">Back</span>
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
        <StudentLessonDetailsHeader lesson={lesson} />
      )}

      {/* Cancellation fee notice */}
      {lesson.cancellation_fee_amount != null &&
        lesson.cancellation_fee_amount > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <MdOutlineFreeCancellation size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Cancellation fee applies</p>
              <p className="mt-0.5 text-amber-700">
                A fee of{" "}
                <span className="font-semibold">
                  {lesson.cancellation_fee_currency ?? "USD"}{" "}
                  {Number(lesson.cancellation_fee_amount).toFixed(2)}
                </span>{" "}
                has been recorded for this lesson due to late cancellation or no
                show.
              </p>
            </div>
          </div>
        )}

      {/* Recording */}
      <div className="gap-4 overflow-hidden border-gray-200">
        {hasRecording ? (
          <video
            src={lesson.recording_url}
            controls
            className="h-full w-full rounded-xl bg-black object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-6 text-center md:py-16">
            <HiOutlineVideoCamera size={32} className="text-gray-300" />
            <p className="no-content">No recording for this lesson.</p>
          </div>
        )}
      </div>

      {/* Details + Notes */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
        {/* Notes */}
        <div className="panel-box col-span-3">
          <p className="panel-header">Meeting Note</p>
          {(authUser?.role === "admin" || lesson.note_shared) &&
          lesson.meeting_note ? (
            <LessonNotesViewer html={lesson.meeting_note} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white py-4 text-center md:py-16">
              <p className="no-content">No meeting note for this lesson</p>
            </div>
          )}
        </div>
        <div className="panel-box col-span-2">
          <div className="space-y-4">
            <div>
              <p className="panel-header">Lesson note</p>
              {lesson.teacher_note ? (
                <p className="rounded-lg text-sm leading-relaxed text-gray-700">
                  {lesson.teacher_note}
                </p>
              ) : (
                <p className="no-content mt-2">No note added.</p>
              )}
            </div>

            <div>
              <p className="panel-header">Meeting feedback</p>
              {lesson.meeting_feedback ? (
                <p className="rounded-lg text-sm leading-relaxed text-gray-700">
                  {lesson.meeting_feedback}
                </p>
              ) : (
                <p className="no-content mt-2">No feedback added.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {authUser?.role === "student" && (
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-5">
          {/* My note  */}
          <InlineStudentNote
            lessonId={lesson.id}
            initialNote={lesson.student_note}
          />

          {/* Cancellation policy */}
          {lesson?.admin && (
            <div className="col-span-2">
              <CancellationPolicyPanel admin={lesson.admin} />
            </div>
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
    </div>
  );
}
