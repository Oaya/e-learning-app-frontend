import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useCourseOverview } from "../../../hooks/useCourseOverview";
import SectionForm from "../../../components/admin/SectionForm";
import { useAlert } from "../../../contexts/AlertContext";
import { useSectionMutations } from "../../../hooks/useSectionMutation";
import SortableSectionList from "../../../components/admin/SortableSectionList";

export default function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();
  const courseId = id ?? "";

  // Add section form toggle
  const [openAddSection, setAddSectionOpen] = useState(false);

  const { createSection, isCreating, reorderSections, isReordering } =
    useSectionMutations(courseId, {
      onCreateSuccess: () => setAddSectionOpen(false),
    });

  const { course, isLoading, isError, error } = useCourseOverview(id ?? "");

  const sections = course?.sections ?? [];

  if (!id) return <p>Invalid course</p>;
  if (isLoading) return <p>Loading…</p>;
  if (!course) return <p>Course not found</p>;

  if (isError)
    alert.error(error instanceof Error ? error.message : "Failed to load");

  return (
    <div>
      {/* Header */}
      <header className="flex items-start justify-between pb-8">
        <div>
          <h1 className="mt-1 text-2xl font-semibold">Curriculum</h1>
          <p className="mt-1 text-sm text-gray-600">
            Build sections and lessons. Drag & drop can come later.
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-6">
        {/* // Sections list (DnD) */}
        <SortableSectionList
          sections={sections}
          courseId={courseId}
          disabled={isCreating || isReordering || openAddSection}
          openAddSection={openAddSection}
          setAddSectionOpen={setAddSectionOpen}
          onReorder={(next) => {
            reorderSections({
              course_id: courseId,
              section_ids: next.map((s) => s.id),
            });
          }}
        />

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
          <div className="flex justify-between py-3">
            <button
              onClick={() => setAddSectionOpen(true)}
              type="button"
              className="bg-dark-purple hover:bg-dark-purple/80 rounded px-4 py-2 text-sm text-white"
            >
              + Section
            </button>
            <div>
              <Link
                to={`/admin/courses/${id}/course-builder`}
                className="mr-4 rounded border border-gray-300 px-4 py-2 text-sm"
              >
                Back
              </Link>
              <Link
                to={`/admin/courses/${id}/pricing`}
                className="bg-dark-purple hover:bg-dark-purple/80 rounded px-4 py-2 text-sm text-white"
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
