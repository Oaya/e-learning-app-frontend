import { useQuery } from "@tanstack/react-query";

import type { Session } from "../../../../type/session";
import { getTodaySessions } from "../../../../api/sessions";

export function useSessions() {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: () => getTodaySessions(),
    staleTime: 60_000,
  });

  console.log("Sessions fetched:", sessionsQuery.data);
  return {
    ...sessionsQuery,
    sessions: sessionsQuery.data,
  };
}
