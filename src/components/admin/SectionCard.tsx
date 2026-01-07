import { BiEditAlt, BiSolidTrashAlt } from "react-icons/bi";
import type { SectionWithLessons } from "../../type/section";
import type { CreateLesson } from "../../type/lesson";
import { useSectionMutations } from "../../hooks/useSectionMutation";
import SectionForm from "./SectionForm";
import LessonForm from "./LessonForm";
import { useState } from "react";
import { useLessonMutations } from "../../hooks/useLessonMutation";

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

  // Add lesson form toggle
  const [openAddLesson, setAddLessonOpen] = useState<{
    isOpen: boolean;
    sectionId: string | null;
  }>({ isOpen: false, sectionId: null });
  const isAddingLessonHere =
    openAddLesson.isOpen && openAddLesson.sectionId === s.id;

  const lessonCount = s.lessons?.length ?? 0;

  const { updateSection, isUpdating } = useSectionMutations(courseId);
  const { createLesson, isCreating } = useLessonMutations(courseId, {
    onCreateSuccess: () => setAddLessonOpen({ isOpen: false, sectionId: null }),
  });

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
            }}
            disabled={
              openAddSection ||
              (isEditingAnySection && !isEditingSection) ||
              isDeleting
            }
            title="Edit section"
          >
            <BiEditAlt size={18} />
          </button>

          {/* Delete section */}
          <button
            type="button"
            className="text-c-pink rounded p-1 text-sm hover:bg-red-50 disabled:opacity-50"
            disabled={openAddSection || isEditingAnySection || isDeleting}
            onClick={() => setDeletingSectionId(s.id)}
            title="Delete section"
          >
            <BiSolidTrashAlt size={18} />
          </button>
        </div>

        {/* Add lesson */}
        <button
          className="bg-c-green hover:bg-c-green/80 rounded px-4 py-2 text-sm text-white disabled:opacity-50"
          onClick={() => {
            // open accordion + show lesson form
            toggleOpen(s.id);
            setAddLessonOpen({ isOpen: true, sectionId: s.id });

            // close other modes
            setEditingSectionId(null);
            setAddSectionOpen(false);
          }}
          disabled={isEditingSection || isDeleting}
        >
          + Lesson
        </button>
      </div>

      {isOpen ? (
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

          {/* Add lesson form */}
          {isAddingLessonHere ? (
            <div className="mb-4">
              <LessonForm
                mode="create"
                isSubmitting={isCreating}
                onSubmit={(values: CreateLesson) =>
                  createLesson({
                    ...values,
                    section_id: s.id,
                  })
                }
                onCancel={() =>
                  setAddLessonOpen({ isOpen: false, sectionId: null })
                }
              />
            </div>
          ) : null}

          {/* Lessons list */}
          <div className="space-y-2">
            {s.lessons?.map((l) => (
              <div
                key={l.id}
                className="group flex items-center justify-between rounded border border-gray-100 px-3 py-2 hover:bg-gray-50"
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
        </div>
      ) : null}
    </div>
  );
}
