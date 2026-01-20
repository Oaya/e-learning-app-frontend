import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Course } from "../type/course";
import { deleteCourse, getCourseById } from "../api/courses";
import { useAlert } from "../contexts/AlertContext";

export function useCourse(
  id: string,
  options?: { onDeleteSuccess?: () => void },
) {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const courseQuery = useQuery<Course, Error>({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing course id");
      return deleteCourse(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.removeQueries({ queryKey: ["course", id] });
      options?.onDeleteSuccess?.();
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to delete course",
      );
    },
  });

  return {
    ...courseQuery,
    course: courseQuery.data,
    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
