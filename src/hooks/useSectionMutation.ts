import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSection, UpdateSection } from "../type/section";
import { createSection, updateSection, deleteSection } from "../api/sections";
import { useAlert } from "../contexts/AlertContext";

export function useSectionMutations(courseId: string) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const createMutation = useMutation({
    mutationFn: (data: CreateSection) => createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to create section",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSection) => updateSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to update section",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) => deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete section",
      );
    },
  });

  return {
    createSection: createMutation.mutate,
    updateSection: updateMutation.mutate,
    deleteSection: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
