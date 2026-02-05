import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { User } from "../type/user";
import { getUsers, deleteUsers } from "../api/users";

import { useAlert } from "../contexts/AlertContext";

export function useUsers() {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const userQuery = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      return deleteUsers(userIds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["users"] });
      alert.success("Users deleted successfully");
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete users",
      );
    },
  });

  return {
    ...userQuery,
    users: userQuery.data,
    deleteUsersMutation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
