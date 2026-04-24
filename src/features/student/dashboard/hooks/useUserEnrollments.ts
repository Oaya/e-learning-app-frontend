import { useQuery } from "@tanstack/react-query";
import type { Enrollment } from "../../../../type/enrollment";
import { getUserEnrollments } from "../../api/user";

export function useUserEnrollments(userId: string) {
  const userQuery = useQuery<Enrollment[], Error>({
    queryKey: ["user", userId, "enrollments"],
    queryFn: () => getUserEnrollments(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  console.log("User enrollments fetched:", userQuery.data);
  return {
    ...userQuery,
    enrollments: userQuery.data,
  };
}
