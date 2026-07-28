import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { Lesson, UpsertLesson } from "../../../../type/lesson";
import {
  cancelLesson,
  createLesson,
  deleteLesson,
  getTodayLessons,
  updateLesson as updateLessonApi,
} from "../../../../api/lessons";

export function useLessons(options?: {
  onDeleteSuccess?: () => void;
  onCancelSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "today"],
    queryFn: () => getTodayLessons(),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: UpsertLesson) => createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", "all"] });
      alert.success("Lesson created successfully.");
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create lesson",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lessons", "today"],
      });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete lesson",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (lessonId: string) => cancelLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      options?.onCancelSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to cancel lesson",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertLesson }) =>
      updateLessonApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", "all"] });
      alert.success("Lesson updated successfully.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    },
  });

  return {
    ...lessonsQuery,
    lessons: lessonsQuery.data,
    createLesson: createMutation.mutateAsync,
    updateLesson: updateMutation.mutateAsync,
    deleteLesson: deleteMutation.mutateAsync,
    cancelLesson: cancelMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCanceling: cancelMutation.isPending,
  };
}
