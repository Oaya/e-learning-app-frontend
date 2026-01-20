import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourses } from "../api/courses";

export function useCourses() {
  const query = useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 60_000,
  });

  return {
    ...query,
    courses: query.data,
  };
}
