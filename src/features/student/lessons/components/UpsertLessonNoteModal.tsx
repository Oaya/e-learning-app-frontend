import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import { HiOutlineX } from "react-icons/hi";
import { useState } from "react";
import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import { useAlert } from "../../../../contexts/AlertContext";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
};

export default function UpsertLessonNoteModal({
  isOpen,
  onClose,
  lessonId,
}: ModalProps) {
  const { lesson, addNote, isAdding } = useLesson(lessonId);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(lesson?.student_note);
  const alert = useAlert();

  if (!isOpen) return null;

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!note) {
      alert.error("Need to add note");
      return;
    }

    setLoading(true);
    try {
      await addNote({ id: lessonId, data: { student_note: note } });
      onClose();
    } catch {
      // handled by the mutation's onError
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">My note</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-lg text-gray-500">
            {lesson?.topic} ·{" "}
            <span>
              {lesson?.scheduled_at &&
                dayjs(lesson.scheduled_at).format("DD MMM YYYY")}
            </span>
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* feedback */}
          <div className="mb-4">
            <label className="sm-label">Note</label>
            <textarea
              name="meeting_feedback"
              rows={5}
              defaultValue={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-4"
            >
              Cancel
            </button>

            <button
              onClick={(e) => handleSubmit(e)}
              className="btn-primary-pink"
              disabled={loading || isAdding}
            >
              {loading || isAdding ? "Saving..." : "Save note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
