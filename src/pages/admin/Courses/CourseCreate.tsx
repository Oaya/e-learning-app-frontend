import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { CreateCourse } from "../../../type/course";
import { createCourse } from "../../../api/courses";
import CourseForm from "../../../components/admin/CourseForm";

export default function CourseCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //Mutation to create a course
  const mutation = useMutation({
    mutationFn: (data: CreateCourse) => createCourse(data),
    onSuccess: (course) => {
      //Refresh the courses list after creating a new course
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      //Navigate to module creation page to add modules
      navigate(`/admin/course/${course.id}/modules/new`);
    },
  });

  return (
    <div className="space-y-6">
      <CourseForm
        mode="create"
        isSubmitting={mutation.isPending}
        error={
          mutation.isError
            ? mutation.error instanceof Error
              ? mutation.error.message
              : "Failed"
            : null
        }
        onSubmit={(values) => mutation.mutate(values)}
      />
    </div>
  );
}
