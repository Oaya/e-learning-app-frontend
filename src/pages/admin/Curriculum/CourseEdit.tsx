import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import type { CreateCourse } from "../../../type/course";
import CourseForm from "../../../components/admin/CourseForm";
import { updateCourse } from "../../../api/courses";
import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";

export default function CourseEdit() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { course, isLoading, isError, error } = useCourseOverview(courseId);

  console.log("course", course);

  const mutation = useMutation({
    mutationFn: (values: CreateCourse) =>
      updateCourse(courseId, {
        title: values.title,
        description: values.description,
        category: values.category,
        level: values.level,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      navigate(`/admin/course/${courseId}/sections/new`);
    },
  });

  if (!courseId) return <p>Invalid course</p>;
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
      <header className="flex h-14 items-center justify-between pb-10">
        <h1 className="text-2xl font-semibold">Course Creation</h1>
      </header>
      <div className="flex gap-10">
        <div className="flex-1">
          <CourseForm
            isSubmitting={mutation.isPending}
            error={
              mutation.isError
                ? mutation.error instanceof Error
                  ? mutation.error.message
                  : "Failed"
                : null
            }
            defaultValues={{
              title: course.title,
              description: course.description,
              category: course.category,
              level: course.level,
            }}
            onSubmit={(data) => mutation.mutate(data)}
          />
        </div>

        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview id={courseId} />
        </div>
      </div>
    </div>
  );
}
