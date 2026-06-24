import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { CreateSession, Session } from "../../../../type/session";
import { createSession, getTodaySessions } from "../../../../api/sessions";

export function useSessions(options?: {
  onCreateSuccess?: (createdSession: Session) => void;
}) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: () => getTodaySessions(),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSession) => createSession(data),
    onSuccess: (createdSession) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      options?.onCreateSuccess?.(createdSession);
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to create lesson",
      );
    },
  });

  return {
    ...sessionsQuery,
    sessions: sessionsQuery.data,
    createSession: createMutation.mutateAsync,

    isCreating: createMutation.isPending,
  };
}
