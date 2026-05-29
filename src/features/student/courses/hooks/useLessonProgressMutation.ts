import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeLessonProgress,
  incompleteLessonProgress,
} from "../../api/lessonProgress";
import type { LessonProgressStatus, UserEnrollmentWithStatus } from "../../../../type/enrollment";

type TogglePayload = {
  lessonProgressId: string;
  isCompleted: boolean;
};

export function useLessonProgressMutation(userId: string, courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["user", userId, "course", courseId, "status"];

  const mutation = useMutation({
    mutationFn: ({ lessonProgressId, isCompleted }: TogglePayload) => {
      if (!lessonProgressId) throw new Error("Missing lesson progress id");
      return isCompleted
        ? incompleteLessonProgress(lessonProgressId)
        : completeLessonProgress(lessonProgressId);
    },
    onMutate: async ({ lessonProgressId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<UserEnrollmentWithStatus>(queryKey);

      queryClient.setQueryData<UserEnrollmentWithStatus>(queryKey, (old) => {
        if (!old?.lesson_progresses) return old;
        const newStatus: LessonProgressStatus = isCompleted ? "not_started" : "completed";
        const updatedProgresses = old.lesson_progresses.map((lp) =>
          lp.id === lessonProgressId ? { ...lp, status: newStatus } : lp,
        );
        const completedCount = updatedProgresses.filter((lp) => lp.status === "completed").length;
        const progress_percentage =
          old.total_lessons > 0
            ? Math.round((completedCount / old.total_lessons) * 100)
            : 0;
        return { ...old, lesson_progresses: updatedProgresses, progress_percentage };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    updateLessonProgress: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
