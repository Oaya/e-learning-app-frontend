import React, { useEffect, useMemo, useState } from "react";
import { fdString } from "../../utils/formData";
import { useAlert } from "../../contexts/AlertContext";
import type { CreateLesson } from "../../type/lesson";
import { lessonTypes } from "../../utils/constants";

type Props = {
  mode: "create" | "edit";
  defaultValues?: CreateLesson;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateLesson) => void;
  onCancel: () => void;
};

export default function LessonForm({
  mode,
  defaultValues,
  isSubmitting = false,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const alert = useAlert();

  // Show toast only when error changes (prevents spam on re-render)
  useEffect(() => {
    if (error) alert.error(error);
  }, [error, alert]);

  // Initial selected type (for create: first type; for edit: from defaults)
  // NOTE: If defaultValues arrive later asynchronously, prefer remounting LessonForm
  // with a changing `key` in the parent (e.g., key={lessonId} or key={sectionId}).
  const initialType = useMemo(() => {
    return defaultValues?.lesson_type ?? lessonTypes[0] ?? "";
  }, [defaultValues?.lesson_type]);

  const [selectedType, setSelectedType] = useState<string>(initialType);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: CreateLesson = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      lesson_type: fdString(fd, "lesson_type").trim(),
      content_url: fdString(fd, "content_url").trim() || undefined,
    };

    onSubmit(data);
  };

  return (
    <div className="mt-3 space-y-6 rounded border border-gray-300 p-3">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Lesson Type</label>

          <div className="flex flex-wrap gap-2">
            {lessonTypes.map((type) => {
              const checked = selectedType === type;

              return (
                <label
                  key={type}
                  className={`cursor-pointer rounded-full border px-4 py-1 text-sm transition disabled:opacity-60 ${
                    checked
                      ? "bg-c-light-yellow border-c-light-yellow text-white"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="lesson_type"
                    value={type}
                    checked={checked}
                    onChange={() => setSelectedType(type)}
                    className="sr-only"
                    required
                    disabled={isSubmitting}
                  />
                  {type}
                </label>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            disabled={isSubmitting}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 disabled:bg-gray-50"
            placeholder="Enter a Title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">
            What will students learn in this lesson?
          </label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            disabled={isSubmitting}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 disabled:bg-gray-50"
            placeholder="Enter lesson description"
          />
        </div>

        {/* Content URL (optional) */}
        <div>
          <input
            name="content_url"
            defaultValue={defaultValues?.content_url ?? ""}
            disabled={isSubmitting}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 disabled:bg-gray-50"
            placeholder="Content URL (optional)"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Add Lesson"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-60"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
