import { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import { useAlert } from "@/contexts/AlertContext";

type Props = {
  lessonId: string;
  initialNote?: string;
};

export default function InlineStudentNote({ lessonId, initialNote }: Props) {
  const { addNote, isAdding } = useLesson(lessonId);
  const alert = useAlert();

  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(initialNote ?? "");
  const [draft, setDraft] = useState(note);

  function handleEdit() {
    setDraft(note);
    setEditing(true);
  }

  function handleCancel() {
    setDraft(note);
    setEditing(false);
  }

  async function handleSave() {
    try {
      await addNote({ id: lessonId, data: { student_note: draft } });
      setNote(draft);
      setEditing(false);
      alert.success("Note saved.");
    } catch {
      // handled by mutation onError
    }
  }

  return (
    <div className="panel-box col-span-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="panel-header">My note</p>
        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="text-theme-purple-50 hover:text-theme-purple-40 flex items-center gap-1.5 text-xs"
          >
            <HiOutlinePencil size={13} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            placeholder="Write your notes for this lesson…"
            className="form-textarea resize-none text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-primary-white text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isAdding}
              className="btn-primary-pink text-sm"
            >
              {isAdding ? "Saving…" : "Save note"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">
          {note || <span className="no-content">No note added.</span>}
        </p>
      )}
    </div>
  );
}
