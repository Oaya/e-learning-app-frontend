import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { UpsertHomework, Homework } from "../../../../type/homework";
import {
  createHomework,
  deleteHomework,
  getHomeworks,
  updateHomework,
} from "../../../../api/homeworks";
import { unwrapResponse } from "../../../../api/helper";

export function useHomeworks(
  studentId?: string,
  options?: {
    onDeleteSuccess?: () => void;
    onCancelSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const homeworksQuery = useQuery<Homework[], Error>({
    queryKey: ["homeworks", studentId ?? null],
    queryFn: async () =>
      unwrapResponse<Homework[]>(await getHomeworks(studentId)),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: UpsertHomework) =>
      unwrapResponse<Homework>(await createHomework(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      alert.success("Homework created successfully.");
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create homework",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (homeworkId: string) =>
      unwrapResponse<void>(await deleteHomework(homeworkId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeworks"],
      });
      alert.success("Homework deleted successfully.");
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete homework",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpsertHomework }) =>
      unwrapResponse<Homework>(await updateHomework(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeworks"] });
      alert.success("Homework updated successfully.");
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
