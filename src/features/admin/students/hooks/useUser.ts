import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { User } from "../../../../type/user";
import { deleteUser, getUser } from "../../../../api/users";
import { useAlert } from "../../../../contexts/AlertContext";

export function useUser(id: string, options?: { onDeleteSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const userQuery = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteUser(id);
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

  console.log("User fetched:", userQuery.data);
  return {
    ...userQuery,
    user: userQuery.data,
    deleteUsersMutation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
