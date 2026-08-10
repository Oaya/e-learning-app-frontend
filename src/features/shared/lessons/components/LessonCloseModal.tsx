type ConfirmModalProps = {
  isOpen: boolean;
  closeModal: (state: string) => void;
};

export default function LessonCloseModal({
  isOpen,
  closeModal,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Leave this Lesson?</h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => closeModal("leave")}
            className="rounded border px-4 py-2"
          >
            Leave
          </button>

          <button
            onClick={() => closeModal("end")}
            className="bg-theme-pink-20 rounded px-4 py-2 text-white"
          >
            End Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
