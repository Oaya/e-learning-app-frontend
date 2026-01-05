import { Link } from "react-router-dom";
import type { CreateCourse } from "../../type/course";
import { fdString } from "../../utils/formData";
import { categories, levels } from "../../utils/constants";

type Props = {
  mode: "course-create" | "course-edit" | "module-create" | "module-edit";
  defaultValues?: CreateCourse;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateCourse) => void;
};

export default function CourseForm({
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
      category: fdString(fd, "category"),
      level: fdString(fd, "level"),
    };

    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 py-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={defaultValues?.title ?? ""}
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="What will students learn?"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              className="mb-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5 shadow-md"
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
              className="mb-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5 shadow-md"
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

        <div>
          <label className="block text-sm font-medium">Course image</label>
          <input type="file" name="image" className="form-input" />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
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
