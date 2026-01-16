import { useState } from "react";
import { BiEditAlt, BiSolidTrashAlt } from "react-icons/bi";

import type { SectionWithLessons } from "../../../type/section";
import type { CreateLesson } from "../../../type/lesson";
import { useSectionMutations } from "../../../hooks/useSectionMutation";
import { useLessonMutations } from "../../../hooks/useLessonMutation";

import SectionForm from "./SectionForm";
import LessonForm from "../lessons/LessonForm";
import ConfirmModal from "../../ui/ConfirmModal";
import SortableLessonList from "../lessons/SortableLessonList";

type Props = {
  section: SectionWithLessons;
  index: number;
  courseId: string;
  openAddSection: boolean;
  setAddSectionOpen: (v: boolean) => void;
};

export default function SectionCard({
  section: s,
  index,
  courseId,
  openAddSection,
  setAddSectionOpen,
}: Props) {
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null,
  );
  const isEditingAnySection = editingSectionId !== null;
  const isEditingSection = editingSectionId === s.id;

  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Track which section accordion is open
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isAddingLessonHere = open[s.id] && isAddingLesson;
  const showAddLessonButton = !isAddingLessonHere;

  const lessonCount = s.lessons?.length ?? 0;

  const toggleOpen = (sectionId: string) =>
    setOpen((prev) => (prev[sectionId] ? {} : { [sectionId]: true }));

  const { updateSection, deleteSection, isUpdating, isDeleting } =
    useSectionMutations(courseId, {
      onUpdateSuccess: () => {
        setEditingSectionId(null);
      },
      onCreateSuccess: () => setAddSectionOpen(false),
      // onUpdateSuccess: (section) => toggleOpen(section.id),
    });

  const { createLesson, isCreating, reorderLessons, isReordering } =
    useLessonMutations(courseId, {
      onCreateSuccess: () => {
        setIsAddingLesson(false);
      },
    });

  const lessons = s.lessons ?? [];

  return (
    <div>
      <ConfirmModal
        isOpen={deletingSectionId !== null}
        isSubmitting={isDeleting}
        message="Are you sure you want to delete this? This action cannot be undone."
        onCancel={() => setDeletingSectionId(null)}
        onConfirm={() => {
          if (!deletingSectionId) return;
          deleteSection(deletingSectionId);
          setDeletingSectionId(null);
        }}
      />

      <div className="rounded border border-gray-200 bg-white shadow-sm">
        {/* Section header */}
        <div className="mr-2 flex items-center justify-between px-4 py-3 text-gray-500">
          <div className="flex items-center">
            <p>
              Section {index + 1}:
              <span className="m-2 font-semibold">{s.title}</span>
            </p>
            <p>( {lessonCount} lessons )</p>

            {/* Edit section */}
            <button
              type="button"
              className="ml-2 rounded p-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
              onClick={() => {
                toggleOpen(s.id);
                setEditingSectionId(s.id);
                setAddSectionOpen(false);
                setIsAddingLesson(false);
              }}
              disabled={
                openAddSection ||
                (isEditingAnySection && !isEditingSection) ||
                isDeleting ||
                isCreating
              }
              title="Edit section"
            >
              <BiEditAlt size={18} />
            </button>

            {/* Delete section */}
            <button
              type="button"
              className="text-c-pink rounded p-1 text-sm hover:bg-red-50 disabled:opacity-50"
              disabled={
                openAddSection ||
                isEditingAnySection ||
                isDeleting ||
                isCreating
              }
              onClick={() => setDeletingSectionId(s.id)}
              title="Delete section"
            >
              <BiSolidTrashAlt size={18} />
            </button>
          </div>

          {/* Add lesson */}
          {showAddLessonButton ? (
            <button
              type="button"
              className="bg-c-yellow hover:bg-c-yellow/80 rounded px-4 py-2 text-sm text-white disabled:opacity-50"
              onClick={() => {
                // ensure accordion open
                toggleOpen(s.id);
                setIsAddingLesson(true);
                setEditingSectionId(null);
                setAddSectionOpen(false);
              }}
              disabled={isEditingSection || isDeleting || isCreating}
            >
              + Lesson
            </button>
          ) : null}
        </div>

        <div className="border-t border-gray-100 px-4 py-3">
          {/* Inline edit SectionForm */}
          {isEditingSection ? (
            <div className="mb-4">
              <SectionForm
                mode="edit"
                defaultValues={{
                  title: s.title,
                  description: s.description ?? "",
                }}
                isSubmitting={isUpdating}
                onSubmit={(values) => updateSection({ ...values, id: s.id })}
                onCancel={() => setEditingSectionId(null)}
              />
            </div>
          ) : null}

          {/* Lessons list (DnD) */}
          <SortableLessonList
            lessons={lessons}
            courseId={courseId}
            disabled={isDeleting || isCreating || isUpdating || isReordering}
            onReorder={(next) => {
              reorderLessons({
                section_id: s.id,
                lesson_ids: next.map((l) => l.id),
              });
            }}
          />

          {/* Add lesson form */}
          {isAddingLesson ? (
            <div className="mb-4">
              <LessonForm
                key={s.id}
                mode="create"
                isSubmitting={isCreating}
                onSubmit={(values: CreateLesson) =>
                  createLesson({ ...values, section_id: s.id })
                }
                onCancel={() => setIsAddingLesson(false)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
