import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { User, UserSort } from "../../../../type/user";
import { getUsers, deleteUsers } from "../../../../api/users";

import { useAlert } from "../../../../contexts/AlertContext";

export type UserQueryInput = {
  filters?: Record<string, string[]>;
  search?: string;
  sorts?: UserSort[];
};

export function useUsers({ filters, search, sorts }: UserQueryInput) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  console.log("sort", sorts);

  const userQuery = useQuery<User[], Error>({
    queryKey: ["users", { filters, search, sorts }],
    queryFn: () => getUsers({ filters, search, sorts }),
    staleTime: 60_000,
    placeholderData: keepPreviousData, // keep the previous data while fetching
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
