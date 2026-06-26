import { useQuery } from "@tanstack/react-query";

import type { Session } from "../../../../type/session";
import { getSessions } from "../../../../api/sessions";

export function useStudentSession() {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: ["sessions", "student"],
    queryFn: () => getSessions(),
    staleTime: 60_000,
  });

  return {
    ...sessionsQuery,
    sessions: sessionsQuery.data,
  };
}
