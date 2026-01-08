import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../contexts/AlertContext";
import type { CreateLesson, UpdateLesson } from "../type/lesson";
import { createLesson, deleteLesson, updateLesson } from "../api/lessons";

export function useLessonMutations(
  courseId: string,
  options?: {
    onCreateSuccess?: () => void;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
  },
) {
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

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLesson) => updateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
      options?.onUpdateSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete lesson",
      );
    },
  });

  return {
    createLesson: createMutation.mutate,
    updateLesson: updateMutation.mutate,
    deleteLesson: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
