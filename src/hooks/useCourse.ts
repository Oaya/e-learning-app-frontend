import { useQuery } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { getCourseById } from "../api/courses";

export const useCourse = (id: string) => {
  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery<Course, Error>({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  return { course, isLoading, isError, error };
};
