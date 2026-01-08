import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../contexts/AlertContext";
import type {
  CreateLesson,
  Lesson,
  ReorderLessons,
  UpdateLesson,
} from "../type/lesson";
import { createLesson, deleteLesson, updateLesson } from "../api/lessons";
import { reorderLessons } from "../api/sections";

export function useLessonMutations(
  courseId: string,
  options?: {
    onCreateSuccess?: (createdLesson: Lesson) => void;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const createMutation = useMutation({
    mutationFn: (data: CreateLesson) => createLesson(data),
    onSuccess: (createdLesson) => {
      queryClient.invalidateQueries({ queryKey: ["courseOverview", courseId] });
      options?.onCreateSuccess?.(createdLesson);
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

  const reorderMutation = useMutation({
    mutationFn: (data: ReorderLessons) => reorderLessons(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to reorder lessons",
      );
    },
  });

  return {
    createLesson: createMutation.mutate,
    updateLesson: updateMutation.mutate,
    deleteLesson: deleteMutation.mutate,
    reorderLessons: reorderMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
