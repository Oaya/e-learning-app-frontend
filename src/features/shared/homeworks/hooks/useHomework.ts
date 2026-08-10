import { useQuery } from "@tanstack/react-query";

import type { Homework } from "../../../../type/homework";
import { getHomework } from "../../../../api/homeworks";
import { unwrapResponse } from "../../../../api/helper";

export function useHomework(id: string) {
  const homeworkQuery = useQuery<Homework, Error>({
    queryKey: ["homework", id],
    queryFn: async () => unwrapResponse<Homework>(await getHomework(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });

  return {
    ...homeworkQuery,
    homework: homeworkQuery.data,
  };
}
