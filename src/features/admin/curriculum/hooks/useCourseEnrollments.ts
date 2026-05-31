import { useQuery } from "@tanstack/react-query";
import type { CourseEnrollments } from "../../../../type/enrollment";
import { getCourseEnrollments } from "../../../../api/enrollments";

export function useCourseEnrollments(id: string) {
  const userQuery = useQuery<CourseEnrollments[], Error>({
    queryKey: ["courseEnrollments", id],
    queryFn: () => getCourseEnrollments(id),
    staleTime: 60_000,
    enabled: !!id,
  });

  return {
    ...userQuery,
    enrollments: userQuery.data,
  };
}
