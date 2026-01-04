import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { useCourse } from "../../../hooks/useCourse";
import type { CreateCourse } from "../../../type/course";
import CourseForm from "../../../components/admin/CourseForm";
import { updateCourse } from "../../../api/courses";

export default function CourseEdit() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { course, isLoading, isError, error } = useCourse(courseId);

  const mutation = useMutation({
    mutationFn: (values: CreateCourse) =>
      updateCourse(courseId, {
        title: values.title,
        description: values.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      navigate(`/admin/course/${courseId}/modules/new`);
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
    <CourseForm
      mode="edit"
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
      }}
      onSubmit={(data) => mutation.mutate(data)}
    />
  );
}
