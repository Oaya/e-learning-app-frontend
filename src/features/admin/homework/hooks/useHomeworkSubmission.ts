import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";

import type {
  FeedbackData,
  HomeworkSubmission,
  UpsertHomeworkSubmission,
} from "../../../../type/homework_submission";
import {
  createFeedback,
  upsertHomeworkSubmission,
} from "../../../../api/homework_submission";
import { useNavigate } from "react-router-dom";

export function useHomeworkSubmission(
  id: string,
  options?: {
    onSaveDraftSuccess?: (submission: HomeworkSubmission) => void;
    onSubmitSuccess?: (submission: HomeworkSubmission) => void;
  },
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const saveDraftMutation = useMutation({
    mutationFn: (data: UpsertHomeworkSubmission) =>
      upsertHomeworkSubmission(data),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ["homework", id] });
      options?.onSaveDraftSuccess?.(submission);
    },
    onError: (err) => {
      console.log(err);
      alert.error(err instanceof Error ? err.message : "Failed to save draft");
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: UpsertHomeworkSubmission) =>
      upsertHomeworkSubmission(data),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ["homework", id] });
      options?.onSubmitSuccess?.(submission);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to submit homework",
      );
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: FeedbackData) => createFeedback(data),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ["homework", id] });
      alert.success("Successfully submit Homework feedback.");
      navigate("/admin/homework");
      options?.onSubmitSuccess?.(submission);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error
          ? err.message
          : "Failed to submit homework feedback",
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
    saveDraft: saveDraftMutation.mutateAsync,
    submitHomework: submitMutation.mutateAsync,
    submitFeedback: feedbackMutation.mutateAsync,
    isSavingDraft: saveDraftMutation.isPending,
    isSubmitting: submitMutation.isPending,
    isSubmittingFeedback: feedbackMutation.isPending,
  };
}
