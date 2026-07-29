import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGoal,
  deleteGoal,
  getUserGoals,
  updateGoal,
} from "../../../../api/goals";
import { useAlert } from "../../../../contexts/AlertContext";
import type { Goal, UpsertGoal } from "../../../../type/goal";
import { unwrapResponse } from "../../../../api/helper";

export function useGoals(userId: string) {
  const queryClient = useQueryClient();
  const alert = useAlert();
  const key = ["goals", userId];

  const query = useQuery<Goal[], Error>({
    queryKey: key,
    queryFn: async () => unwrapResponse<Goal[]>(await getUserGoals(userId)),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: UpsertGoal) =>
      unwrapResponse<Goal>(await createGoal(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      alert.success("Goal added successfully");
    },
    onError: () => alert.error("Failed to add goal"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpsertGoal }) =>
      unwrapResponse<Goal>(await updateGoal(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      alert.success("Goal updated successfully");
    },
    onError: () => alert.error("Failed to update goal"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (goalId: string) =>
      unwrapResponse<void>(await deleteGoal(goalId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      alert.success("Goal deleted Successfully");
    },
    onError: () => alert.error("Failed to delete goal"),
  });

  return {
    goals: query.data,
    isLoading: query.isLoading,
    createGoal: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateGoal: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteGoal: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
