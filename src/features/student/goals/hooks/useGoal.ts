import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGoalById,
  createGoalActivity,
  deleteGoalActivity,
  updateGoalActivity,
} from "../../../../api/goals";
import { useAlert } from "../../../../contexts/AlertContext";
import type {
  Goal,
  GoalActivity,
  UpsertGoalActivity,
} from "../../../../type/goal";
import { unwrapResponse } from "../../../../api/helper";

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
      unwrapResponse<GoalActivity>(await createGoalActivity(goalId, data)),
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
      unwrapResponse<GoalActivity>(await updateGoalActivity(goalId, data)),
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

  return {
    goal: goalQuery.data,
    isLoading: goalQuery.isLoading,
    addActivityLog: createActivityMutation.mutateAsync,
    isAddingActivity: createActivityMutation.isPending,
    updateActivityLog: updateActivityMutation.mutateAsync,
    isUpdatingActivity: updateActivityMutation.isPending,
    removeActivity: deleteActivityMutation.mutateAsync,
    isRemovingActivity: deleteActivityMutation.isPending,
  };
}
