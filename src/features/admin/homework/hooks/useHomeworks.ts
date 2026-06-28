import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { UpsertHomework, Homework } from "../../../../type/homework";
import {
  createHomework,
  deleteHomework,
  getHomework,
  getHomeworks,
  updateHomework,
} from "../../../../api/homeworks";

export function useHomeworks(options?: {
  onCreateSuccess?: (createdHomework: Homework) => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onCancelSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const homeworksQuery = useQuery<Homework[], Error>({
    queryKey: ["homeworks"],
    queryFn: () => getHomeworks(),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: UpsertHomework) => createHomework(data),
    onSuccess: (createdHomework) => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      options?.onCreateSuccess?.(createdHomework);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create homework",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (homeworkId: string) => deleteHomework(homeworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeworks"],
      });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete homework",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertHomework }) =>
      updateHomework(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      options?.onUpdateSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update homework",
      );
    },
  });

  return {
    ...homeworksQuery,
    homeworks: homeworksQuery.data,
    createHomework: createMutation.mutateAsync,
    updateHomework: updateMutation.mutateAsync,
    deleteHomework: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
