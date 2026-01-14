import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Course, CreateCourse } from "../../type/course";
import { fdString } from "../../utils/formData";
import { categories, levels } from "../../utils/constants";
import { useAlert } from "../../contexts/AlertContext";
import {
  createCourseWithThumbnail,
  updateCourseWithThumbnail,
} from "../../api/courses";

type CourseFormProps = {
  isEdit?: boolean;
  defaultValues?: Course;
  courseId?: string;
};
export default function CourseForm({
  isEdit,
  defaultValues,
  courseId,
}: CourseFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.thumbnail_url || null,
  );
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState<boolean>(false);

  const existingKey = defaultValues?.thumbnail_key ?? null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const alert = useAlert();

  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) URL.revokeObjectURL(previewUrl);
  //   };
  // }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (previewUrl && newFile) URL.revokeObjectURL(previewUrl);
    setNewFile(file);
    setRemoved(false);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const removeImage = () => {
    if (previewUrl && newFile) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setNewFile(null);
    setRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const data = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      category: fdString(fd, "category"),
      level: fdString(fd, "level"),
      thumbnail: fd.get("thumbnail") as File | null,
    };

    console.log(data);

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: (values: CreateCourse) => {
      if (isEdit && courseId) {
        return updateCourseWithThumbnail({
          newFile,
          removed,
          existingKey,
          courseId,
          data: values,
        });
      }
      return createCourseWithThumbnail(values);
    },

    onSuccess: (result: any) => {
      // refresh list + specific course (if edit)
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      const nextId = isEdit ? courseId : result.id;

      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["courses", nextId] });
      }

      navigate(`/admin/courses/${nextId}/curriculum-builder`);
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save course");
    },
  });

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            className="form-input mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            required
            className="form-textarea mt-1 w-full"
            placeholder="What will students learn?"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              className="form-input py-2.5"
              defaultValue={defaultValues?.category ?? ""}
            >
              <option value="">--Select category--</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium">Level</label>
            <select
              name="level"
              className="form-input py-2.5"
              defaultValue={defaultValues?.level ?? ""}
            >
              <option value="">--Select level--</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <div className="flex flex-row items-center justify-between">
              <p className="block text-sm font-medium">Course image</p>
              {previewUrl && (
                <button onClick={removeImage} type="button">
                  <AiOutlineClose size={16} />
                </button>
              )}
            </div>

            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="mt-1 max-h-full max-w-full"
                />
              </div>
            )}
          </div>

          <div className="mb-2 h-60 overflow-y-auto">
            <p className="block pt-5 text-sm">
              Upload your course image here. Recommended size: 720x405 pixels;
              .jpg, .jpeg, .gif, or .png. No text on the image.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              id="thumbnail"
              name="thumbnail"
              className="sr-only"
              onChange={handleImageChange}
            />

            <label
              htmlFor="thumbnail"
              className="form-input mt-2 inline-block cursor-pointer"
            >
              Upload image
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save & Continue"}
          </button>

          <Link
            to="/admin/"
            className="rounded border border-gray-300 px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
