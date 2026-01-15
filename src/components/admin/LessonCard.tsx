import { BiEditAlt, BiSolidTrashAlt } from "react-icons/bi";

import { useState } from "react";
import ConfirmModal from "../ui/ConfirmModal";
import { useLessonMutations } from "../../hooks/useLessonMutation";
import LessonForm from "./LessonForm";
import type { Lesson } from "../../type/lesson";

type Props = {
  lesson: Lesson;
  courseId: string;
};

export default function LessonCard({ lesson, courseId }: Props) {
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const { deleteLesson, updateLesson, isDeleting, isCreating, isUpdating } =
    useLessonMutations(courseId, {
      onDeleteSuccess: () => setDeletingLessonId(null),
      onUpdateSuccess: () => setEditingLessonId(null),
    });

  const isEditing = editingLessonId === lesson.id;

  return (
    <div>
      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deletingLessonId !== null}
        isSubmitting={isDeleting}
        message="Are you sure you want to delete this? This action cannot be undone."
        onCancel={() => setDeletingLessonId(null)}
        onConfirm={() => {
          if (!deletingLessonId) return;
          deleteLesson(deletingLessonId);
          setDeletingLessonId(null);
        }}
      />

      <div
        key={lesson.id}
        className="group bg-bg-grey py- flex items-center rounded border border-gray-100 px-3 py-1 hover:bg-gray-200"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-xs text-gray-500">
            Lesson {lesson.position}
          </span>
          <span className="bg-c-light-yellow border-c-light-yellow rounded-full px-2 py-0.5 text-xs font-medium text-white">
            {lesson.lesson_type}
          </span>
          <span>{lesson.title}</span>
        </div>

        <div className="flex items-center p-1 px-4 opacity-0 transition group-hover:opacity-100">
          {/* Edit lesson */}
          <button
            type="button"
            className="rounded p-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
            onClick={() => setEditingLessonId(lesson.id)}
            disabled={isDeleting || isUpdating}
            title="Edit lesson"
          >
            <BiEditAlt size={18} />
          </button>

          {/* Delete section */}
          <button
            type="button"
            className="text-c-pink rounded p-1 text-sm hover:bg-red-50 disabled:opacity-50"
            disabled={isDeleting || isCreating} //    openAddLesson || isEditingAnyLesson ||
            onClick={() => setDeletingLessonId(lesson.id)}
            title="Delete lesson"
          >
            <BiSolidTrashAlt size={18} />
          </button>
        </div>
      </div>

      {/* Inline edit form */}
      {isEditing ? (
        <div className="mt-2">
          <LessonForm
            key={lesson.id}
            mode="edit"
            isSubmitting={isUpdating}
            defaultValues={lesson}
            onSubmit={(values) => {
              updateLesson({ id: lesson.id, ...values });
            }}
            onCancel={() => setEditingLessonId(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
