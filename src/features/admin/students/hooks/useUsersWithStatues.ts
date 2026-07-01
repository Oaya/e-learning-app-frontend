import { useQuery } from "@tanstack/react-query";
import type { UserWithStatues } from "../../../../type/user";
import { getUsersWithStatues } from "../../../../api/users";

export function useUsersWithStatuses() {
  const userQuery = useQuery<UserWithStatues[], Error>({
    queryKey: ["userWithStatues"],
    queryFn: () => getUsersWithStatues(),
    staleTime: 60_000,
  });

  console.log("Users WithStatus fetched:", userQuery.data);
  return {
    ...userQuery,
    users: userQuery.data,
  };
}
