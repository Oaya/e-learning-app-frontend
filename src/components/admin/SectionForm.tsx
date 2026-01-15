import { fdString } from "../../utils/formData";

type Props = {
  mode: "create" | "edit";
  defaultValues?: { title: string; description: string };
  isSubmitting?: boolean;
  onSubmit: (values: { title: string; description: string }) => void;
  onCancel: () => void;
};

export default function SectionForm({
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
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
    <div className="space-y-6 rounded border-gray-300">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <h1> {mode === "edit" ? "Edit Section" : "New Section"}</h1>
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
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2"
            placeholder="Enter learning outcomes"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className="primary-submit-button"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Add Section"}
          </button>

          <button className="curriculum-back-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
