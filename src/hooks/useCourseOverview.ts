import { useQuery } from "@tanstack/react-query";
import type { CourseOverview } from "../type/course";
import { getCourseOverview } from "../api/courses";

export const useCourseOverview = (id: string) => {
  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery<CourseOverview, Error>({
    queryKey: ["courseOverview", id],
    queryFn: () => getCourseOverview(id),
    enabled: !!id,
  });

  return { course, isLoading, isError, error };
};
