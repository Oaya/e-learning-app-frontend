import { fdString } from "../../utils/formData";

import { useAlert } from "../../contexts/AlertContext";
import type { CreateLesson } from "../../type/lesson";

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
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const alert = useAlert();

  if (error) {
    alert.error(error);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      lesson_type: fdString(fd, "lesson_type").trim(),
      content_url: fdString(fd, "content_url").trim() || undefined,
    };

    onSubmit(data);
  };

  return (
    <div className="space-y-6 rounded border-gray-300">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <h1> {mode === "edit" ? "Edit Lesson" : "New Lesson"}</h1>
        <div>
          <input
            name="lesson_type"
            defaultValue={defaultValues?.lesson_type ?? ""}
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="Lesson Type (e.g., video, article)"
          />
        </div>
        <div>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="Enter a Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            What will students learn in this lesson?
          </label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="Enter lesson description"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Add Lesson"}
          </button>

          <button
            className="rounded border border-gray-300 px-4 py-2 text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
