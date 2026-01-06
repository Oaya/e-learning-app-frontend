import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { CreateCourse } from "../../../type/course";
import { createCourse } from "../../../api/courses";
import CourseForm from "../../../components/admin/CourseForm";
import CourseOverview from "../../../components/admin/CourseOverview";

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
            onSubmit={(values) => mutation.mutate(values)}
          />
        </div>

        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview />
        </div>
      </div>
    </div>
  );
}
