import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLessonProgresses } from "../../api/enrollment";

export function useCourseStartMutation(
  enrollmentId: string,
  options?: {
    onStartSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();

  const startEnrollmentMutation = useMutation({
    mutationFn: async () => createLessonProgresses(enrollmentId),

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
