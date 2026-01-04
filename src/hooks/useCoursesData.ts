import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourses } from "../services/courses";

export const useCoursesData = () => {
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
