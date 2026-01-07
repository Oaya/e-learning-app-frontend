import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { BiSolidTrashAlt } from "react-icons/bi";

import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";
import SectionForm from "../../../components/admin/SectionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSection, UpdateSection } from "../../../type/section";
import { createSection, updateSection } from "../../../api/section";
import { useAlert } from "../../../contexts/AlertContext";

export default function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Track which section accordion is open
  const [open, setOpen] = useState<Record<string, boolean>>({});
  // Add section form toggle
  const [openAddSection, setAddSectionOpen] = useState(false);
  // Which section is currently being edited (inline)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const { course, isLoading, isError, error } = useCourseOverview(id ?? "");

  const toggleOpen = (sectionId: string) =>
    setOpen((s) => ({ ...s, [sectionId]: !s[sectionId] }));

  const isEditingAnySection = editingSectionId !== null;

  //Mutation to create a Section
  const createSectionMutation = useMutation({
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

  //Mutation to update a section
  const updateSectionMutation = useMutation({
    mutationFn: (data: UpdateSection) => updateSection(data),
    onSuccess: () => {
      //Refresh the sections list after updating a section
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", id],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update section",
      );
    },
  });

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

      <div className="flex gap-10">
        <div className="flex-1 space-y-6">
          {/* // Sections list */}
          <div className="space-y-4">
            {course.sections.map((s, i) => {
              const isOpen = !!open[s.id];
              const isEditingSection = editingSectionId === s.id;

              return (
                <div
                  key={s.id}
                  className="rounded border border-gray-200 bg-white shadow-sm"
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      className="flex items-center"
                      onClick={() => toggleOpen(s.id)}
                      disabled={isEditingSection} // optional: prevent accordion toggle while editing
                    >
                      <p className="text-xs text-gray-500">
                        Section {i + 1}:
                        <span className="m-2 font-semibold">{s.title}</span>
                      </p>

                      <p className="text-xs text-gray-500">
                        ( {s.lessons?.length} lessons )
                      </p>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => {
                          // ensure the accordion opens so the edit form is visible
                          setOpen((o) => ({ ...o, [s.id]: true }));
                          setEditingSectionId(s.id);
                          // optionally close add form
                          setAddSectionOpen(false);
                        }}
                        disabled={
                          openAddSection ||
                          (isEditingAnySection && !isEditingSection)
                        }
                      >
                        <BiEditAlt size={18} />
                      </button>
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        disabled={openAddSection || isEditingAnySection}
                        onClick={() => {
                          // TODO: delete section mutation
                          alert.error("Delete section not implemented yet");
                        }}
                      >
                        <BiSolidTrashAlt size={18} />
                      </button>
                    </div>
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
                              description: s.description,
                            }}
                            isSubmitting={updateSectionMutation.isPending}
                            error={
                              updateSectionMutation.isError
                                ? updateSectionMutation.error instanceof Error
                                  ? updateSectionMutation.error.message
                                  : "Failed"
                                : null
                            }
                            onSubmit={(values) =>
                              updateSectionMutation.mutate({
                                ...values,
                                id: s.id,
                              })
                            }
                            onCancel={() => setEditingSectionId(null)}
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
                              onClick={() =>
                                navigate(`/admin/lessons/${l.id}/edit`)
                              }
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
                                onClick={() =>
                                  navigate(`/admin/lessons/${l.id}/edit`)
                                }
                              >
                                <BiEditAlt size={18} />
                              </button>
                              <button
                                type="button"
                                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  // TODO: delete lesson mutation
                                  alert.error(
                                    "Delete lesson not implemented yet",
                                  );
                                }}
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
            })}
          </div>

          <div className="rounded border border-gray-200 bg-white shadow-sm">
            {/* //If the setAddSectionOpen is true show the SectionForm */}
            {openAddSection ? (
              <div className="px-4 py-3">
                <SectionForm
                  mode="create"
                  isSubmitting={createSectionMutation.isPending}
                  error={
                    createSectionMutation.isError
                      ? createSectionMutation.error instanceof Error
                        ? createSectionMutation.error.message
                        : "Failed"
                      : null
                  }
                  onSubmit={(values) =>
                    createSectionMutation.mutate({ ...values, course_id: id })
                  }
                  onCancel={() => setAddSectionOpen(false)}
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
