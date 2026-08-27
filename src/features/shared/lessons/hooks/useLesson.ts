import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Lesson, UpsertLessonMeeting } from "@/type/lesson";
import { unwrapResponse } from "@/api/helper";
import {
  AddStudentNote,
  cancelLesson as cancelLessonApi,
  getLessonById,
  upsertLessonMeeting,
} from "@/api/lessons";
import { useAlert } from "@/contexts/AlertContext";

export function useLesson(id: string) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const lessonsQuery = useQuery<Lesson, Error>({
    queryKey: ["lesson", id],
    queryFn: async () => unwrapResponse<Lesson>(await getLessonById(id)),
    staleTime: 60_000,
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpsertLessonMeeting;
    }) => unwrapResponse<Lesson>(await upsertLessonMeeting(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", "all"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      alert.success("Lesson ended successfully.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { student_note: string };
    }) => unwrapResponse<Lesson>(await AddStudentNote(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      alert.success("Lesson Note Updated successfully.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update lesson",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (lessonId: string) =>
      unwrapResponse<Lesson>(await cancelLessonApi(lessonId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      queryClient.invalidateQueries({ queryKey: ["lessons", "all"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", "today"] });
      alert.success("Lesson cancelled.");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to cancel lesson",
      );
    },
  });

  return {
    ...lessonsQuery,
    lesson: lessonsQuery.data,
    endingLesson: updateMutation.mutateAsync,
    addNote: addNoteMutation.mutateAsync,
    cancelLesson: cancelMutation.mutateAsync,
    isEnding: updateMutation.isPending,
    isAdding: addNoteMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
