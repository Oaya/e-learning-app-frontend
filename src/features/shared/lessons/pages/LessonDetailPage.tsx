import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { HiOutlineVideoCamera } from "react-icons/hi";
import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import { useLessons } from "@/features/admin/lessons/hooks/useLessons";
import ConfirmModal from "@/ui/ConfirmModal";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LessonDetailsHeader from "@/features/admin/lessons/components/LessonDetailsHeader";
import { useAuth } from "@/contexts/AuthContext";
import StudentLessonDetailsHeader from "@/features/student/lessons/components/StudentLessonDetailsHeader";
import UpsertLessonNoteModal from "@/features/student/lessons/components/UpsertLessonNoteModal";
import CompleteLessonModal from "@/features/admin/lessons/components/CompleteLessonModal";
import UpsertLessonModal from "@/features/admin/lessons/components/UpsertLessonModal";
import LessonNotesViewer from "@/features/shared/lessons/components/LessonNoteViewer";
import PageLoadingState from "@/ui/PageLoadingState";

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
      <div className="gap-5 overflow-hidden border-gray-200">
        {hasRecording ? (
          <video
            src={lesson.recording_url}
            controls
            className="h-full w-full rounded-xl bg-black object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16 text-center">
            <HiOutlineVideoCamera size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400 italic">
              No recording for this lesson.
            </p>
          </div>
        )}
      </div>

      {/* Details + Notes */}
      <div className="grid grid-cols-5 gap-4">
        {/* Notes */}
        <div className="panel-box col-span-3">
          <p className="panel-header">Meeting Note</p>
          {(authUser?.role === "admin" || lesson.note_shared) &&
          lesson.meeting_note ? (
            <LessonNotesViewer html={lesson.meeting_note} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white py-16 text-center">
              <p className="text-sm text-gray-400 italic">
                No meeting note for this lesson
              </p>
            </div>
          )}
        </div>
        <div className="panel-box col-span-2">
          <p className="panel-header mb-4">Notes</p>
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Lesson note
              </p>
              {lesson.teacher_note ? (
                <p className="rounded-lg text-sm leading-relaxed text-gray-700">
                  {lesson.teacher_note}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">No note added.</p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Meeting feedback
              </p>
              {lesson.meeting_feedback ? (
                <p className="rounded-lg text-sm leading-relaxed text-gray-700">
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
            <p className="rounded-lg text-sm leading-relaxed text-gray-700">
              {lesson.student_note}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No note added.</p>
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
