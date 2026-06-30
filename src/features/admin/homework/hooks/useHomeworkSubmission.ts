import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";

import type {
  HomeworkSubmission,
  UpsertHomeworkSubmission,
} from "../../../../type/homework_submission";
import { upsertHomeworkSubmission } from "../../../../api/homework_submission";

export function useHomeworkSubmission(
  id: string,
  options?: {
    onUpsertSuccess?: (upsertHWSubmission: HomeworkSubmission) => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const upsertMutation = useMutation({
    mutationFn: (data: UpsertHomeworkSubmission) =>
      upsertHomeworkSubmission(data),
    onSuccess: (upsertHWSubmission) => {
      queryClient.invalidateQueries({ queryKey: ["homework", id] });
      options?.onUpsertSuccess?.(upsertHWSubmission);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : `Failed to submit homework`,
      );
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
    upsertHomeworkSubmission: upsertMutation.mutateAsync,

    // updateHomework: updateMutation.mutateAsync,
    // deleteHomework: deleteMutation.mutateAsync,
    // // cancelhomework: cancelMutation.mutateAsync,

    isUpserting: upsertMutation.isPending,

    // isUpdating: updateMutation.isPending,
    // isDeleting: deleteMutation.isPending,
    // isCanceling: cancelMutation.isPending,
  };
}
