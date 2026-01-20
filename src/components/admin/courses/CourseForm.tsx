import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiSolidTrashAlt } from "react-icons/bi";

import type { Course, CreateCourse } from "../../../type/course";
import { fdString } from "../../../utils/formData";
import { categories, levels } from "../../../utils/constants";
import { useAlert } from "../../../contexts/AlertContext";
import {
  createCourseWithThumbnail,
  updateCourseWithThumbnail,
} from "../../../api/courses";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (previewUrl && newFile) URL.revokeObjectURL(previewUrl);
    setNewFile(file);
    setRemoved(false);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (previewUrl && newFile) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setNewFile(null);
    setRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const fileFromInput = fd.get("thumbnail");

    const file =
      newFile ??
      (fileFromInput instanceof File && fileFromInput.size > 0
        ? fileFromInput
        : null);

    const data: CreateCourse = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      category: fdString(fd, "category"),
      level: fdString(fd, "level"),
      thumbnail: file ?? undefined,
    };

    console.log(data);

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: (values: CreateCourse) => {
      if (isEdit && courseId) {
        return updateCourseWithThumbnail({
          new_file: newFile,
          removed,
          existing_key: existingKey,
          course_id: courseId,
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
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="h-full w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
              <img
                src={previewUrl ? previewUrl : "/src/assets/placeholder.webp"}
                alt="Placeholder"
                className={`h-full w-full ${
                  previewUrl ? "object-cover" : "object-contain"
                }`}
              />
            </div>
          </div>

          <div className="mb-2 overflow-y-auto">
            <p className="block text-sm">
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
              className="form-input mt-2 flex cursor-pointer items-center justify-between"
            >
              <span className="text-md">
                {newFile
                  ? newFile.name
                  : removed
                    ? "Upload Image"
                    : defaultValues?.thumbnail_name
                      ? "Replace Image"
                      : "Upload Image"}
              </span>

              {/* show trash if there is either a new file OR an existing image */}
              {(newFile || (!!defaultValues?.thumbnail_name && !removed)) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-c-pink ml-4"
                  aria-label="Remove image"
                  disabled={mutation.isPending}
                >
                  <BiSolidTrashAlt size={18} />
                </button>
              )}
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
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
