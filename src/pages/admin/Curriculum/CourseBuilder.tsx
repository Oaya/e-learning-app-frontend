import { useParams } from "react-router-dom";

import CourseForm from "../../../components/admin/courses/CourseForm";
import { useCourse } from "../../../hooks/useCourse";

export default function CourseBuilderPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const isEdit = mode === "edit";

  const { course, isLoading, isError, error } = useCourse(courseId);

  if (isEdit && !courseId) return <p>Invalid course</p>;
  if (isEdit && isLoading) return <p>Loading…</p>;
  if (isEdit && isError)
    return (
      <p className="text-red-600">
        {error instanceof Error ? error.message : "Failed to load course"}
      </p>
    );
  if (isEdit && !course) return <p>Course not found</p>;

  return (
    <div className="curriculum-container">
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Course" : "Course Creation"}
        </h1>
      </header>

      <div className="flex-1">
        <CourseForm
          isEdit={isEdit}
          defaultValues={isEdit && course ? { ...course } : undefined}
        />
      </div>
    </div>
  );
}
