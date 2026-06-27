import { useQuery } from "@tanstack/react-query";

import type { Lesson } from "../../../../type/lesson";
import { getLessons } from "../../../../api/lessons";

export function useAllLessons() {
  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "all"],
    queryFn: () => getLessons(),
    staleTime: 60_000,
  });

  return {
    ...lessonsQuery,
    lessons: lessonsQuery.data,
  };
}
