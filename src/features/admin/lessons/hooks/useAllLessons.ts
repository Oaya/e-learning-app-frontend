import { useQuery } from "@tanstack/react-query";

import type { Lesson } from "../../../../type/lesson";
import { getLessons } from "../../../../api/lessons";

export function useAllLessons(studentId?: string) {
  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "all", studentId ?? null],
    queryFn: () => getLessons(studentId),
    staleTime: 60_000,
  });

  return {
    ...lessonsQuery,
    lessons: lessonsQuery.data,
  };
}
