import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/contexts/AlertContext";

import type {
  FeedbackData,
  HomeworkSubmission,
  UpsertHomeworkSubmission,
} from "@/type/homework_submission";
import {
  createFeedback,
  upsertHomeworkSubmission,
} from "@/api/homework_submission";
import { unwrapResponse } from "@/api/helper";

export function useHomeworkSubmission(
  id: string,
  options?: {
    onSaveDraftSuccess?: (submission: HomeworkSubmission) => void;
    onSubmitSuccess?: (submission: HomeworkSubmission) => void;
    onSubmitFeedbackSuccess?: (submission: HomeworkSubmission) => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const saveDraftMutation = useMutation({
    mutationFn: async (data: UpsertHomeworkSubmission) =>
      unwrapResponse<HomeworkSubmission>(
        await upsertHomeworkSubmission(data),
      ),
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
    mutationFn: async (data: UpsertHomeworkSubmission) =>
      unwrapResponse<HomeworkSubmission>(
        await upsertHomeworkSubmission(data),
      ),
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
    mutationFn: async (data: FeedbackData) =>
      unwrapResponse<HomeworkSubmission>(await createFeedback(data)),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ["homework", id] });
      alert.success("Successfully submit Homework feedback.");
      options?.onSubmitFeedbackSuccess?.(submission);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error
          ? err.message
          : "Failed to submit homework feedback",
      );
    },
  });

  return {
    saveDraft: saveDraftMutation.mutateAsync,
    submitHomework: submitMutation.mutateAsync,
    submitFeedback: feedbackMutation.mutateAsync,
    isSavingDraft: saveDraftMutation.isPending,
    isSubmitting: submitMutation.isPending,
    isSubmittingFeedback: feedbackMutation.isPending,
  };
}
