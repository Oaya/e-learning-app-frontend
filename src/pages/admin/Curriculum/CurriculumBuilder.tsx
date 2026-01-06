import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";
import ModuleForm from "../../../components/admin/ModuleForm";

export default function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [openAddSection, setAddSectionOpen] = useState(false);

  const { course, isLoading, isError, error } = useCourseOverview(id ?? "");

  const toggleOpen = (moduleId: string) =>
    setOpen((s) => ({ ...s, [moduleId]: !s[moduleId] }));

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
          {/* // Modules list */}
          <div className="space-y-4">
            {course.modules.map((m, i) => {
              const isOpen = !!open[m.id];

              return (
                <div
                  key={m.id}
                  className="rounded border border-gray-200 bg-white shadow-sm"
                >
                  {/* Module header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div
                      className="flex items-center"
                      onClick={() => toggleOpen(m.id)}
                    >
                      <p className="text-xs text-gray-500">
                        Section {i + 1}:
                        <span className="m-2 font-semibold">{m.title}</span>
                      </p>

                      <p className="text-xs text-gray-500">
                        ( {m.lessons?.length} lessons )
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
            {/* //If the setAddSectionOpen is true show the ModuleForm */}
            {openAddSection ? (
              <div className="px-4 py-3">
                <ModuleForm onSubmit={() => {}} />
              </div>
            ) : (
              <div className="px-4 py-3">
                <button
                  onClick={() => setAddSectionOpen(true)}
                  type="button"
                  className="bg-dark-purple hover:bg-dark-purple/80 rounded px-2 py-2 text-sm text-white"
                >
                  Add Section
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
