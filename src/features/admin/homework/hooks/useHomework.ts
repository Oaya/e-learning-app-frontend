import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { UpsertHomework, Homework } from "../../../../type/homework";
import { createHomework, getHomework } from "../../../../api/homeworks";

export function useHomework(
  id: string,
  options?: {
    onCreateSuccess?: (createdHomework: Homework) => void;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
    onCancelSuccess?: () => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const homeworkQuery = useQuery<Homework, Error>({
    queryKey: ["homework", id],
    queryFn: () => getHomework(id),
    enabled: !!id,
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
    ...homeworkQuery,
    homework: homeworkQuery.data,
    // createHomework: createMutation.mutateAsync,
    // updateHomework: updateMutation.mutateAsync,
    // deleteHomework: deleteMutation.mutateAsync,
    // // cancelhomework: cancelMutation.mutateAsync,

    // isCreating: createMutation.isPending,
    // isUpdating: updateMutation.isPending,
    // isDeleting: deleteMutation.isPending,
    // isCanceling: cancelMutation.isPending,
  };
}
