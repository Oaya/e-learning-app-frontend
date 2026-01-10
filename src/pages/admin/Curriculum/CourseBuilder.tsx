import { useParams } from "react-router-dom";

import CourseForm from "../../../components/admin/CourseForm";
import CourseOverview from "../../../components/admin/CourseOverview";

import { useCourseOverview } from "../../../hooks/useCourseOverview";

export default function CourseBuilder({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const isEdit = mode === "edit";

  // Only fetch existing course data in edit mode
  const { course, isLoading, isError, error } = useCourseOverview(
    isEdit ? courseId : "",
  );

  if (isEdit && !courseId) return <p>Invalid course</p>;
  if (isEdit && isLoading) return <p>Loading…</p>;
  if (isEdit && isError)
    return (
      <p className="text-red-600">
        {error instanceof Error ? error.message : "Failed"}
      </p>
    );
  if (isEdit && !course) return <p>Course not found</p>;

  return (
    <div>
      <header className="flex h-14 items-center justify-between pb-10">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Course" : "Course Creation"}
        </h1>
      </header>

      <div className="flex gap-10">
        <div className="flex-1">
          <CourseForm
            isEdit={isEdit}
            courseId={isEdit ? courseId : undefined}
            defaultValues={
              isEdit && course
                ? {
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    level: course.level,
                    thumbnail_key: course.thumbnail_key,
                    thumbnail_url: course.thumbnail_url,
                    published: course.published,
                    created_at: course.created_at,
                  }
                : undefined
            }
          />
        </div>

        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview id={isEdit ? courseId : undefined} />
        </div>
      </div>
    </div>
  );
}
