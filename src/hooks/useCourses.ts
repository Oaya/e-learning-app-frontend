import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourses } from "../api/courses";

export function useCourses() {
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return { courses, isLoading, isError };
}
