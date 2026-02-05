import { useQuery } from "@tanstack/react-query";

import type { User } from "../type/user";
import { getUser } from "../api/users";

export function useUser(id: string) {
  const userQuery = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  console.log("User fetched:", userQuery.data);
  return {
    ...userQuery,
    user: userQuery.data,
  };
}
