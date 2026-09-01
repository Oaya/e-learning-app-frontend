import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { InviteUser, User } from "@/type/user";
import { getStudents, inviteUser } from "@/api/users";
import { unwrapResponse } from "@/api/helper";
import { useAlert } from "@/contexts/AlertContext";

export function useUsers() {
  const userQuery = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => unwrapResponse<User[]>(await getStudents()),
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
