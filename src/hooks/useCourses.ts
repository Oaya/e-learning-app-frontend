import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourses } from "../api/courses";

export const useCourses = () => {
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: getCourses,
    select: (data) => data ?? [],
  });

  return { courses, isLoading, isError };
};
