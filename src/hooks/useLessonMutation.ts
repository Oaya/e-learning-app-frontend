import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../contexts/AlertContext";
import type { CreateLesson } from "../type/lesson";
import { createLesson } from "../api/lessons";

type Options = {
  onCreateSuccess?: () => void;
};

export function useLessonMutations(courseId: string, options?: Options) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const createMutation = useMutation({
    mutationFn: (data: CreateLesson) => createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseOverview", courseId] });
      options?.onCreateSuccess?.();
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create lesson",
      );
    },
  });

  return {
    createLesson: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
