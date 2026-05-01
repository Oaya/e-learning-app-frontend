import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeLessonProgress,
  incompleteLessonProgress,
} from "../../api/lessonProgress";

type TogglePayload = {
  lessonProgressId: string;
  isCompleted: boolean;
};

export function useLessonProgressMutation(userId: string, courseId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ lessonProgressId, isCompleted }: TogglePayload) => {
      if (!lessonProgressId) throw new Error("Missing lesson progress id");
      return isCompleted
        ? incompleteLessonProgress(lessonProgressId)
        : completeLessonProgress(lessonProgressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", userId, "course", courseId, "status"],
      });
    },
  });

  return {
    updateLessonProgress: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
