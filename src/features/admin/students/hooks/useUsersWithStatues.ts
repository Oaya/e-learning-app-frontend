import { useQuery } from "@tanstack/react-query";
import type { StudentWithStatues } from "../../../../type/user";
import { getStudentsWithStatues } from "../../../../api/users";
import { unwrapResponse } from "../../../../api/helper";

export function useUsersWithStatuses() {
  const userQuery = useQuery<StudentWithStatues[], Error>({
    queryKey: ["userWithStatues"],
    queryFn: async () =>
      unwrapResponse<StudentWithStatues[]>(await getStudentsWithStatues()),
    staleTime: 60_000,
  });

  console.log("Users WithStatus fetched:", userQuery.data);
  return {
    ...userQuery,
    users: userQuery.data,
  };
}
