import { Link } from "react-router-dom";

import { fdString } from "../../utils/formData";

import type { CreateModule } from "../../type/module";

type Props = {
  defaultValues?: CreateModule;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateModule) => void;
};

export default function ModuleForm({
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
    <div className="space-y-6 rounded border border-gray-300 p-6">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <h1>New Section</h1>
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
            What will students be able to do at the end of this section?
          </label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="Enter learning outcomes"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Add Section"}
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
