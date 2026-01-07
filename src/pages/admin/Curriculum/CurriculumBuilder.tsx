import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";
import SectionForm from "../../../components/admin/SectionForm";
import { useAlert } from "../../../contexts/AlertContext";

import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useSectionMutations } from "../../../hooks/useSectionMutation";
import SectionCard from "../../../components/admin/SectionCard";

export default function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();

  const navigate = useNavigate();

  const courseId = id ?? "";

  const { createSection, deleteSection, isCreating, isDeleting } =
    useSectionMutations(courseId);

  // Track which section accordion is open
  const [open, setOpen] = useState<Record<string, boolean>>({});
  // Add section form toggle
  const [openAddSection, setAddSectionOpen] = useState(false);

  // Which section is currently being edited (inline)

  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null,
  );

  const { course, isLoading, isError, error } = useCourseOverview(id ?? "");

  const toggleOpen = (sectionId: string) =>
    setOpen((prev) => (prev[sectionId] ? {} : { [sectionId]: true }));

  if (!id) return <p>Invalid course</p>;
  if (isLoading) return <p>Loading…</p>;
  if (!course) return <p>Course not found</p>;

  if (isError)
    alert.error(error instanceof Error ? error.message : "Failed to load");

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

      {/* Header */}
      <header className="flex items-start justify-between pb-8">
        <div>
          <h1 className="mt-1 text-2xl font-semibold">Curriculum</h1>
          <p className="mt-1 text-sm text-gray-600">
            Build sections and lessons. Drag & drop can come later.
          </p>
        </div>
      </header>

      <div className="flex gap-10">
        <div className="flex-1 space-y-6">
          {/* // Sections list */}
          <div className="space-y-4">
            {course.sections.map((s, i) => (
              <SectionCard
                key={s.id}
                section={s}
                index={i}
                courseId={courseId}
                isOpen={!!open[s.id]}
                toggleOpen={toggleOpen}
                openAddSection={openAddSection}
                setAddSectionOpen={setAddSectionOpen}
                setDeletingSectionId={(id) => setDeletingSectionId(id)}
                isDeleting={isDeleting}
                navigateToLessonEdit={(lessonId) =>
                  navigate(`/admin/lessons/${lessonId}/edit`)
                }
                alertError={(msg) => alert.error(msg)}
              />
            ))}
          </div>

          {/* //If the setAddSectionOpen is true show the SectionForm */}
          {openAddSection ? (
            <div className="rounded border border-gray-200 bg-white shadow-sm">
              <div className="px-4 py-3">
                <SectionForm
                  mode="create"
                  isSubmitting={isCreating}
                  onSubmit={(values) =>
                    createSection({ ...values, course_id: id })
                  }
                  onCancel={() => setAddSectionOpen(false)}
                />
              </div>
            </div>
          ) : (
            <div className="py-3">
              <button
                onClick={() => setAddSectionOpen(true)}
                type="button"
                className="bg-dark-purple hover:bg-dark-purple/80 rounded px-4 py-2 text-sm text-white"
              >
                + Section
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview id={id} />
        </div>
      </div>
    </div>
  );
}
