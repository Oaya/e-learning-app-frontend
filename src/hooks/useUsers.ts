import { useQuery } from "@tanstack/react-query";

import type { User } from "../type/user";
import { getUsers } from "../api/users";

export function useUsers() {
  const userQuery = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60_000,
  });

  return {
    ...userQuery,
    users: userQuery.data,
  };
}
