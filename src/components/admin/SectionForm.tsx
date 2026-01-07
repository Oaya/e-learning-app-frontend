import { fdString } from "../../utils/formData";

import type { CreateSection } from "../../type/section";
import { useAlert } from "../../contexts/AlertContext";

type Props = {
  defaultValues?: CreateSection;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateSection) => void;
  setAddSectionOpen: (open: boolean) => void;
};

export default function SectionForm({
  defaultValues,
  isSubmitting,
  error,
  onSubmit,
  setAddSectionOpen,
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
    };

    onSubmit(data);
  };

  return (
    <div className="space-y-6 rounded border-gray-300">
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

          <button
            className="rounded border border-gray-300 px-4 py-2 text-sm"
            onClick={() => setAddSectionOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
