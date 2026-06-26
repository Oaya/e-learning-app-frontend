import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../contexts/AlertContext";
import type { Session, UpsertSession } from "../../../../type/session";
import {
  cancelSession,
  createSession,
  deleteSession,
  getTodaySessions,
  updateSession as updateSessionApi,
} from "../../../../api/sessions";

export function useSessions(options?: {
  onCreateSuccess?: (createdSession: Session) => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onCancelSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: () => getTodaySessions(),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: UpsertSession) => createSession(data),
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

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete lesson",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (sessionId: string) => cancelSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      options?.onCancelSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to cancel session",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertSession }) =>
      updateSessionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      options?.onUpdateSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update session",
      );
    },
  });

  return {
    ...sessionsQuery,
    sessions: sessionsQuery.data,
    createSession: createMutation.mutateAsync,
    updateSession: updateMutation.mutateAsync,
    deleteSession: deleteMutation.mutateAsync,
    cancelSession: cancelMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCanceling: cancelMutation.isPending,
  };
}
