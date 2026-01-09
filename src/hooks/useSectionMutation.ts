import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateSection,
  ReorderSections,
  Section,
  UpdateSection,
} from "../type/section";
import { createSection, updateSection, deleteSection } from "../api/sections";
import { useAlert } from "../contexts/AlertContext";
import { reorderSections } from "../api/courses";

export function useSectionMutations(
  courseId: string,
  options?: {
    onCreateSuccess?: () => void;
    onUpdateSuccess?: (updatedSection: Section) => void;
  },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const createMutation = useMutation({
    mutationFn: (data: CreateSection) => createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
      options?.onCreateSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to create section",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSection) => updateSection(data),
    onSuccess: (updatedSection) => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
      options?.onUpdateSuccess?.(updatedSection);
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

  const reorderMutation = useMutation({
    mutationFn: (data: ReorderSections) => reorderSections(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to reorder sections",
      );
    },
  });

  return {
    createSection: createMutation.mutate,
    updateSection: updateMutation.mutate,
    deleteSection: deleteMutation.mutate,
    reorderSections: reorderMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
