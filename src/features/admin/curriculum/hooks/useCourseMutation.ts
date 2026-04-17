import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Course, UpsertCourse } from "../../../../type/course";
import {
  addCoursePrice,
  createCourse,
  deleteCourse,
  getCourseById,
  publishCourse,
  updateCourse,
} from "../../../../api/courses";
import { useAlert } from "../../../../contexts/AlertContext";

type UpsertVariables = {
  isEdit: boolean;
  values: UpsertCourse;
};

export function useCourse(
  id: string,
  options?: {
    onDeleteSuccess?: () => void;
    onUpsertSuccess?: (courseId: string) => void;
    onPriceSaveSuccess?: () => void;
    onSubmitCourseSuccess?: () => void;
  },
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

  const upsertMutation = useMutation({
    mutationFn: async ({ isEdit, values }: UpsertVariables) => {
      console.log({ isEdit, values, id });
      if (isEdit && id) {
        return updateCourse(id, values);
      }
      return createCourse(values);
    },
    onSuccess: async (result: any, variables: UpsertVariables) => {
      // refresh list + specific course (if edit)
      await queryClient.invalidateQueries({ queryKey: ["courses"] });

      const nextId = variables.isEdit && id ? id : result.id;

      queryClient.invalidateQueries({ queryKey: ["courses", nextId] });

      options?.onUpsertSuccess?.(nextId);
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save course");
    },
  });

  const priceMutation = useMutation({
    mutationFn: (price: number) => {
      if (!id) throw new Error("Missing course id");
      return addCoursePrice({ id, price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      options?.onPriceSaveSuccess?.();
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save course");
    },
  });

  const submitCourseMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing course id");
      return publishCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      options?.onSubmitCourseSuccess?.();
    },
    onError: (err) => {
      alert.error(
        err instanceof Error ? err.message : "Failed to publish course",
      );
    },
  });

  return {
    ...courseQuery,
    course: courseQuery.data,
    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    upsertMutation: upsertMutation.mutateAsync,
    isUpserting: upsertMutation.isPending,
    savePrice: priceMutation.mutateAsync,
    isSavingPrice: priceMutation.isPending,
    submitCourseMutation: submitCourseMutation.mutateAsync,
    isSubmittingCourse: submitCourseMutation.isPending,
  };
}
