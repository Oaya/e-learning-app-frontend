import { useQuery } from "@tanstack/react-query";
import type { CourseOverview } from "../type/course";
import { getCourseOverview } from "../api/courses";

export const useCourseOverview = (id: string) => {
  const query = useQuery<CourseOverview, Error>({
    queryKey: ["courseOverview", id],
    queryFn: () => getCourseOverview(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  return {
    ...query,
    course: query.data,
  };
};
