import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { HomeworkSubmission } from "../../../../type/homework";

import type { UpsertHomeworkSubmission } from "../../../../type/homework_submission";
import {
  createHomeworkSubmission,
  draftSaveHomeworkSubmission,
} from "../../../../api/homework_submission";

export function useHomeworkSubmission(options?: {
  onCreateSuccess?: (createdHWSubmission: HomeworkSubmission) => void;
  onSaveDraftSuccess?: (draft: HomeworkSubmission) => void;
}) {
  // const queryClient = useQueryClient();
  const alert = useAlert();

  // const homeworkSubmissionQuery = useQuery<HomeworkSubmission, Error>({
  //   queryKey: ["homeworkSubmissions", id],
  //   queryFn: () => getHomeworkSubmission(id),
  //   enabled: !!id,
  //   staleTime: 60_000,
  // });

  const createMutation = useMutation({
    mutationFn: (data: UpsertHomeworkSubmission) =>
      createHomeworkSubmission(data),
    onSuccess: (createdHWSubmission) => {
      // queryClient.invalidateQueries({ queryKey: ["homeworkSubmissions", id] });
      options?.onCreateSuccess?.(createdHWSubmission);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create homework",
      );
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (data: UpsertHomeworkSubmission) =>
      draftSaveHomeworkSubmission(data),
    onSuccess: (draftHWSubmission) => {
      options?.onSaveDraftSuccess?.(draftHWSubmission);
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save draft");
    },
  });

  // const deleteMutation = useMutation({
  //   mutationFn: (homeworkId: string) => deleteHomework(homeworkId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["homeworks"],
  //     });
  //     options?.onDeleteSuccess?.();
  //   },
  //   onError: (error) => {
  //     alert.error(
  //       error instanceof Error ? error.message : "Failed to delete homework",
  //     );
  //   },
  // });

  // const cancelMutation = useMutation({
  //   mutationFn: (homeworkId: string) => cancelhomework(homeworkId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["homeworks"] });
  //     options?.onCancelSuccess?.();
  //   },
  //   onError: (error) => {
  //     alert.error(
  //       error instanceof Error ? error.message : "Failed to cancel homework",
  //     );
  //   },
  // });

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: UpsertHomework }) =>
  //     updateHomework(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["homeworks"] });
  //     options?.onUpdateSuccess?.();
  //   },
  //   onError: (error) => {
  //     alert.error(
  //       error instanceof Error ? error.message : "Failed to update homework",
  //     );
  //   },
  // });

  return {
    // ...homeworkSubmissionQuery,
    // homeworkSubmission: homeworkSubmissionQuery.data,
    createHomeworkSubmission: createMutation.mutateAsync,
    saveHomeworkSubmission: saveDraftMutation.mutateAsync,
    // updateHomework: updateMutation.mutateAsync,
    // deleteHomework: deleteMutation.mutateAsync,
    // // cancelhomework: cancelMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isSaving: saveDraftMutation.isPending,
    // isUpdating: updateMutation.isPending,
    // isDeleting: deleteMutation.isPending,
    // isCanceling: cancelMutation.isPending,
  };
}
