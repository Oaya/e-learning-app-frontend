import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UpdateStudentData, User } from "../../../../type/user";
import { deleteUser, getUser, updateStudent } from "../../../../api/users";
import { unwrapResponse } from "../../../../api/helper";
import { useAlert } from "../../../../contexts/AlertContext";

export function useUser(
  id: string,
  options?: { onDeleteSuccess?: () => void },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const userQuery = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: async () => unwrapResponse<User>(await getUser(id)),
    enabled: !!id,
    staleTime: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateStudentData) =>
      unwrapResponse<User>(await updateStudent(id, data)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert.success("Student updated");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update student",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return unwrapResponse<void>(await deleteUser(id));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.removeQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userWithStatues"] });
      alert.success("User deleted successfully");
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    },
  });

  return {
    ...userQuery,
    user: userQuery.data,
    updateStudentMutation: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteUsersMutation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
