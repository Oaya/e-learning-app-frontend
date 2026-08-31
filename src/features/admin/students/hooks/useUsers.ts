import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { InviteUser, User, UserSort } from "@/type/user";
import { getStudents, inviteUser } from "@/api/users";
import { unwrapResponse } from "@/api/helper";
import { useAlert } from "@/contexts/AlertContext";

export type UserQueryInput = {
  filters?: Record<string, string[]>;
  search?: string;
  sorts?: UserSort[];
};

export function useUsers({ filters, search, sorts }: UserQueryInput) {
  const userQuery = useQuery<User[], Error>({
    queryKey: ["users", { filters, search, sorts }],
    queryFn: async () =>
      unwrapResponse<User[]>(await getStudents({ filters, search, sorts })),
    staleTime: 60_000,
    placeholderData: keepPreviousData, // keep the previous data while fetching
  });

  return {
    ...userQuery,
    users: userQuery.data,
  };
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteUser | InviteUser[]) =>
      unwrapResponse<{ message: string }>(await inviteUser(data)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userWithStatues"] });
      alert.success(data.message);
    },
    onError: (error) => {
      alert.error(
        error instanceof Error
          ? error.message
          : "Failed to send invitation. Try again later.",
      );
    },
  });

  return {
    inviteUser: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
  };
}
