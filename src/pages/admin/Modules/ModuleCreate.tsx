import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import type { CreateModule } from "../../../type/module";
import { createModule } from "../../../api/module";
import CourseForm from "../../../components/admin/CourseForm";
import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";

export default function ModuleCreate() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const { course, isLoading, isError, error } = useCourseOverview(courseId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //Mutation to create module
  const mutation = useMutation({
    mutationFn: (data: CreateModule) => createModule(data),
    onSuccess: (module) => {
      //Refresh the courses list after creating a new course
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      //Navigate to the course edit page to add modules and lessons
      // navigate(`/admin/course/${courseId}/modules/new`);
      console.log("Module created:", module);
    },
  });

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CourseForm
          mode="module-create"
          isSubmitting={mutation.isPending}
          error={
            mutation.isError
              ? mutation.error instanceof Error
                ? mutation.error.message
                : "Failed"
              : null
          }
          onSubmit={(data) => mutation.mutate(data)}
        />
      </div>

      {/* Right: Overview */}
      <div className="w-110 shrink-0">
        <CourseOverview id={courseId} />
      </div>
    </div>
  );
}
