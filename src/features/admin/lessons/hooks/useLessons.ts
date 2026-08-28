import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/contexts/AlertContext";
import type { Lesson, UpsertLesson } from "@/type/lesson";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getTodayLessons,
  updateLesson as updateLessonApi,
} from "@/api/lessons";
import { unwrapResponse } from "@/api/helper";

export function useLessons(
  studentId?: string,
  options?: {
    onDeleteSuccess?: () => void;
    onCancelSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const todayLessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "today"],
    queryFn: async () => unwrapResponse<Lesson[]>(await getTodayLessons()),
    staleTime: 60_000,
  });

  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", studentId ?? null],
    queryFn: async () => unwrapResponse<Lesson[]>(await getLessons(studentId)),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: UpsertLesson) =>
      unwrapResponse<Lesson>(await createLesson(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      alert.success("Lesson created successfully.");
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create lesson",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) =>
      unwrapResponse<void>(await deleteLesson(lessonId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      alert.success("Lesson deleted successfully.");
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete lesson",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpsertLesson }) =>
      unwrapResponse<Lesson>(await updateLessonApi(id, data)),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      alert.success("Lesson updated successfully.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    },
  });

  return {
    ...todayLessonsQuery,
    todayLessons: todayLessonsQuery.data,
    ...lessonsQuery,
    lessons: lessonsQuery.data,
    createLesson: createMutation.mutateAsync,
    updateLesson: updateMutation.mutateAsync,
    deleteLesson: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
