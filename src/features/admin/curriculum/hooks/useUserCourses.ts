import { useQuery } from "@tanstack/react-query";

import type { Course } from "../../../../type/course";
import { getUserCourses } from "../../../../api/users";

export function useUserCourses(userId: string) {
  const userQuery = useQuery<Course[], Error>({
    queryKey: ["user", userId, "courses"],
    queryFn: () => getUserCourses(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  console.log("User courses fetched:", userQuery.data);
  return {
    ...userQuery,
    courses: userQuery.data,
  };
}
