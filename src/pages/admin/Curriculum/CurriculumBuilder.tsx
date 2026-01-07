import { useState } from "react";

import { useParams } from "react-router-dom";

import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";
import SectionForm from "../../../components/admin/SectionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSection } from "../../../type/section";
import { createSection } from "../../../api/section";
import { useAlert } from "../../../contexts/AlertContext";

export default function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [openAddSection, setAddSectionOpen] = useState(false);

  const { course, isLoading, isError, error } = useCourseOverview(id ?? "");

  const toggleOpen = (sectionId: string) =>
    setOpen((s) => ({ ...s, [sectionId]: !s[sectionId] }));

  //Mutation to create a Section
  const mutation = useMutation({
    mutationFn: (data: CreateSection) => createSection(data),
    onSuccess: () => {
      //Refresh the sections list after creating a new section
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", id],
      });

      setAddSectionOpen(false);
    },

    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to create section",
      );
    },
  });

  if (!id) return <p>Invalid course</p>;
  if (isLoading) return <p>Loading…</p>;
  if (isError)
    return (
      <p className="text-red-600">
        {error instanceof Error ? error.message : "Failed"}
      </p>
    );
  if (!course) return <p>Course not found</p>;

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

      <div className="flex gap-10">
        <div className="flex-1 space-y-6">
          {/* // Sections list */}
          <div className="space-y-4">
            {course.sections.map((s, i) => {
              const isOpen = !!open[s.id];

              return (
                <div
                  key={s.id}
                  className="rounded border border-gray-200 bg-white shadow-sm"
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div
                      className="flex items-center"
                      onClick={() => toggleOpen(s.id)}
                    >
                      <p className="text-xs text-gray-500">
                        Section {i + 1}:
                        <span className="m-2 font-semibold">{s.title}</span>
                      </p>

                      <p className="text-xs text-gray-500">
                        ( {s.lessons?.length} lessons )
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded border border-gray-200 bg-white shadow-sm">
            {/* //If the setAddSectionOpen is true show the SectionForm */}
            {openAddSection ? (
              <div className="px-4 py-3">
                <SectionForm
                  isSubmitting={mutation.isPending}
                  error={
                    mutation.isError
                      ? mutation.error instanceof Error
                        ? mutation.error.message
                        : "Failed"
                      : null
                  }
                  onSubmit={(values) =>
                    mutation.mutate({ ...values, course_id: id })
                  }
                  setAddSectionOpen={setAddSectionOpen}
                />
              </div>
            ) : (
              <div className="px-4 py-3">
                <button
                  onClick={() => setAddSectionOpen(true)}
                  type="button"
                  className="bg-dark-purple hover:bg-dark-purple/80 rounded px-2 py-2 text-sm text-white"
                >
                  + Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview id={id} />
        </div>
      </div>
    </div>
  );
}
