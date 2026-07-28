import { useQuery } from "@tanstack/react-query";

import type { Lesson } from "../../../../type/lesson";
import { getLessons } from "../../../../api/lessons";
import { unwrapResponse } from "../../../../api/helper";

export function useAllLessons(studentId?: string) {
  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "all", studentId ?? null],
    queryFn: async () => unwrapResponse<Lesson[]>(await getLessons(studentId)),
    staleTime: 60_000,
  });

  return {
    ...lessonsQuery,
    lessons: lessonsQuery.data,
  };
}
