import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGoalById,
  createGoalActivity,
  deleteGoalActivity,
  updateGoalActivity,
  createGoalComment,
  deleteGoalComment,
} from "@/api/goals";
import { useAlert } from "@/contexts/AlertContext";
import type { Goal, UpsertGoalActivity } from "@/type/goal";
import { unwrapResponse } from "@/api/helper";

export function useGoal(goalId: string) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const goalQuery = useQuery<Goal, Error>({
    queryKey: ["goal", goalId],
    queryFn: async () => unwrapResponse<Goal>(await getGoalById(goalId)),
    staleTime: 60_000,
    enabled: !!goalId,
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: UpsertGoalActivity) =>
      unwrapResponse<Goal>(await createGoalActivity(goalId, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", goalId],
      });
      alert.success("Activity added");
    },
    onError: () => alert.error("Failed to add activity"),
  });

  const updateActivityMutation = useMutation({
    mutationFn: async (data: UpsertGoalActivity) =>
      unwrapResponse<Goal>(await updateGoalActivity(goalId, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", goalId],
      });
      alert.success("Activity updated");
    },
    onError: () => alert.error("Failed to add activity"),
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) =>
      unwrapResponse<void>(await deleteGoalActivity(goalId, activityId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", goalId],
      });
      alert.success("Activity removed");
    },
    onError: () => alert.error("Failed to remove activity"),
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: string) =>
      unwrapResponse<Goal>(await createGoalComment(goalId, comment)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", goalId],
      });
      alert.success("Comment added");
    },
    onError: () => alert.error("Failed to add comment"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) =>
      unwrapResponse<Goal>(await deleteGoalComment(goalId, commentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", goalId],
      });
      alert.success("Comment removed");
    },
    onError: () => alert.error("Failed to remove comment"),
  });

  return {
    goal: goalQuery.data,
    isLoading: goalQuery.isLoading,
    addActivityLog: createActivityMutation.mutateAsync,
    isAddingActivity: createActivityMutation.isPending,
    updateActivityLog: updateActivityMutation.mutateAsync,
    isUpdatingActivity: updateActivityMutation.isPending,
    removeActivity: deleteActivityMutation.mutateAsync,
    isRemovingActivity: deleteActivityMutation.isPending,
    createComment: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    removeComment: deleteCommentMutation.mutateAsync,
    isRemovingComment: deleteCommentMutation.isPending,
  };
}
