import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiSolidTrashAlt } from "react-icons/bi";

import type { Course, CreateCourse } from "../../../type/course";
import { fdString } from "../../../utils/formData";
import { categories, levels } from "../../../utils/constants";
import { useAlert } from "../../../contexts/AlertContext";
import { createCourse, updateCourse } from "../../../api/courses";
import { useInstructors } from "../../../hooks/useInstructors";
import CustomSelect from "../../ui/CustomSelect";
import type { Instructor } from "../../../type/user";

type CourseFormProps = {
  isEdit?: boolean;
  defaultValues?: Course;
};
export default function CourseForm({ isEdit, defaultValues }: CourseFormProps) {
  const { instructors } = useInstructors();

  const [selectedInstructor, setSelectedInstructor] = useState<Instructor[]>(
    defaultValues?.instructors ?? [],
  );
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    defaultValues?.thumbnail || null,
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState<boolean>(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old blob preview URL if any
    if (thumbnailPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setThumbnailFile(file);
    setRemoved(false);
    setThumbnailPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (thumbnailPreviewUrl && thumbnailPreviewUrl.startsWith("blob:"))
      URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(null);
    setThumbnailFile(null);
    setRemoved(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const data: CreateCourse = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      category: fdString(fd, "category"),
      level: fdString(fd, "level"),
      instructor_ids: selectedInstructor.map((i) => i.id),
      thumbnail: thumbnailFile,
      thumbnail_signed_id: "",
    };

    console.log(data);

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: (values: CreateCourse) => {
      if (isEdit && defaultValues?.id) {
        return updateCourse(defaultValues.id, values);
      }
      return createCourse(values);
    },

    onSuccess: (result: any) => {
      // refresh list + specific course (if edit)
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      const nextId = isEdit && defaultValues?.id ? defaultValues.id : result.id;

      if (isEdit && defaultValues?.id) {
        queryClient.invalidateQueries({
          queryKey: ["courses", defaultValues.id],
        });
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
          <label className="sm-label">Title</label>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            className="form-input mt-1 w-full"
          />
        </div>

        <div>
          <label className="sm-label">Description</label>
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
            <label className="sm-label">Category</label>
            <CustomSelect
              name="category"
              options={categories.map((category) => ({
                value: category,
                label: category,
              }))}
              defaultValue={
                defaultValues?.level
                  ? {
                      value: defaultValues.category,
                      label: defaultValues.category,
                    }
                  : undefined
              }
            />
          </div>

          <div className="mb-2">
            <label className="sm-label">Level</label>
            <CustomSelect
              name="level"
              options={levels.map((level) => ({
                value: level,
                label: level,
              }))}
              defaultValue={
                defaultValues?.category
                  ? {
                      value: defaultValues.level,
                      label: defaultValues.level,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="gap-6">
          <div className="mb-2">
            <label className="sm-label">Instructor</label>
            <CustomSelect
              isMulti
              name="instructor"
              withAvatar
              options={(instructors ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
              }))}
              defaultValue={(defaultValues?.instructors ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
              }))}
              onChange={(selected: any[]) => {
                const ids = Array.isArray(selected)
                  ? selected.map((o) => o.value)
                  : [];
                const picked = (instructors ?? []).filter((i) =>
                  ids.includes(i.id),
                );
                setSelectedInstructor(picked);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <div className="h-full w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
              <img
                src={thumbnailPreviewUrl || "/src/assets/placeholder.webp"}
                alt="Placeholder"
                className={`h-full w-full ${
                  thumbnailPreviewUrl ? "object-cover" : "object-contain"
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
                {thumbnailFile
                  ? thumbnailFile.name
                  : removed
                    ? "Upload Image"
                    : defaultValues?.thumbnail
                      ? "Replace Image"
                      : "Upload Image"}
              </span>

              {/* show trash if there is either a new file OR an existing image */}
              {(thumbnailFile || (!!defaultValues?.thumbnail && !removed)) && (
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
