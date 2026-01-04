import { Link } from "react-router-dom";
import type { CreateCourse } from "../../type/course";
import { fdString } from "../../utils/formData";

type Props = {
  mode: "create" | "edit";
  defaultValues?: CreateCourse;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateCourse) => void;
};

export default function CourseForm({
  mode,
  defaultValues,
  isSubmitting,
  error,
  onSubmit,
}: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
    };

    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "New course" : "Edit course"}
          </h1>
          <p className="text-sm text-gray-600">
            {mode === "create"
              ? "Create the course first, you'll add modules and lessons next."
              : "Update course details. Modules and lessons are managed separately."}
          </p>
        </div>

        <Link to="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-5 rounded border bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="What will students learn?"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="bg-c-pink rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>

          <Link
            to="/admin/courses"
            className="rounded border border-gray-300 px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
