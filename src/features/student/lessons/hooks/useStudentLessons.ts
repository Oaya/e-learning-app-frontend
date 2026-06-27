import { useQuery } from "@tanstack/react-query";

import type { Lesson } from "../../../../type/lesson";
import { getLessons } from "../../../../api/lessons";

export function useStudentLesson() {
  const lessonsQuery = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "student"],
    queryFn: () => getLessons(),
    staleTime: 60_000,
  });

  return {
    ...lessonsQuery,
    lessons: lessonsQuery.data,
  };
}
