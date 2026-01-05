import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourseOverview } from "../api/courses";

export const useCourseOverview = (id: string) => {
  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery<Course, Error>({
    queryKey: ["course", id],
    queryFn: () => getCourseOverview(id),
    enabled: !!id,
  });

  return { course, isLoading, isError, error };
};
