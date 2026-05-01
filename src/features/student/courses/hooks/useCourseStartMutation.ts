import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLessonProgresses } from "../../api/lessonProgress";

export function useCourseStartMutation(
  enrollmentId: string,
  options?: {
    onStartSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();

  const startEnrollmentMutation = useMutation({
    mutationFn: async () => {
      if (!enrollmentId) throw new Error("Missing enrollment id");
      return createLessonProgresses(enrollmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "enrollments", enrollmentId],
      });
      options?.onStartSuccess?.();
    },
  });

  return {
    startEnrollmentMutation: startEnrollmentMutation.mutateAsync,
    isStarting: startEnrollmentMutation.isPending,
  };
}
