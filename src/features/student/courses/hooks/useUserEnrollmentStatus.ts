import { useQuery } from "@tanstack/react-query";
import { getUserCourseWithStatus } from "../../api/user";
import type { UserEnrollmentWithStatus } from "../../../../type/enrollment";

export function useUserEnrollmentStatus(userId: string, courseId: string) {
  const userQuery = useQuery<UserEnrollmentWithStatus, Error>({
    queryKey: ["user", userId, "course", courseId, "status"],
    queryFn: () => getUserCourseWithStatus(userId, courseId),
    enabled: !!userId && !!courseId,
    staleTime: 60_000,
  });

  console.log("User course status fetched:", userQuery.data);
  return {
    ...userQuery,
    enrollment: userQuery.data,
  };
}
