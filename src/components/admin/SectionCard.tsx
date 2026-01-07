import { useState } from "react";
import { BiEditAlt, BiSolidTrashAlt } from "react-icons/bi";

import type { SectionWithLessons } from "../../type/section";
import type { CreateLesson } from "../../type/lesson";
import { useSectionMutations } from "../../hooks/useSectionMutation";
import { useLessonMutations } from "../../hooks/useLessonMutation";

import SectionForm from "./SectionForm";
import LessonForm from "./LessonForm";

type Props = {
  section: SectionWithLessons;
  index: number;
  courseId: string;

  // accordion
  isOpen: boolean;
  toggleOpen: (sectionId: string) => void;

  // add section state (disables edit/delete while add section is open)
  openAddSection: boolean;
  setAddSectionOpen: (v: boolean) => void;

  // delete confirm
  setDeletingSectionId: (id: string) => void;
  isDeleting: boolean;

  // navigation + alert
  navigateToLessonEdit: (lessonId: string) => void;
  alertError: (msg: string) => void;
};

export default function SectionCard({
  section: s,
  index,
  courseId,
  isOpen,
  toggleOpen,
  openAddSection,
  setAddSectionOpen,
  setDeletingSectionId,
  isDeleting,
  navigateToLessonEdit,
  alertError,
}: Props) {
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const isEditingAnySection = editingSectionId !== null;
  const isEditingSection = editingSectionId === s.id;

  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const lessonCount = s.lessons?.length ?? 0;

  const { updateSection, isUpdating } = useSectionMutations(courseId);
  const { createLesson, isCreating } = useLessonMutations(courseId, {
    onCreateSuccess: () => setIsAddingLesson(false),
  });

  const isAddingLessonHere = isOpen && isAddingLesson;
  const showAddLessonButton = !isAddingLessonHere;

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 text-gray-500">
        <div className="flex items-center gap-2">
          <p>
            Section {index + 1}:
            <span className="m-2 font-semibold">{s.title}</span>
          </p>
          <p>( {lessonCount} lessons )</p>

          {/* Edit section */}
          <button
            type="button"
            className="rounded p-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
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
              openAddSection || isEditingAnySection || isDeleting || isCreating
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
              if (!isOpen) toggleOpen(s.id);

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

        {/* Lessons list */}
        <div className="mb-4 space-y-2">
          {s.lessons?.map((l) => (
            <div
              key={l.id}
              className="group bg-bg-grey flex items-center justify-between rounded border border-gray-100 px-3 py-2 hover:bg-gray-200"
            >
              <button
                type="button"
                className="flex flex-1 items-center gap-3 text-left"
                onClick={() => navigateToLessonEdit(l.id)}
              >
                <span className="text-xs text-gray-500">
                  Lesson {l.position}
                </span>
                <span>{l.title}</span>
              </button>

              <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-white hover:text-gray-900"
                  onClick={() => navigateToLessonEdit(l.id)}
                  title="Edit lesson"
                >
                  <BiEditAlt size={18} />
                </button>

                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                  onClick={() =>
                    alertError("Delete lesson not implemented yet")
                  }
                  title="Delete lesson"
                >
                  <BiSolidTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

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
  );
}
