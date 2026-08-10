import { useState, useRef } from "react";
import {
  HiOutlineXMark,
  HiOutlineDocumentArrowUp,
  HiOutlineTrash,
} from "react-icons/hi2";
import type { Homework } from "../../../../type/homework";

type Props = {
  hw: Homework;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hwId: string, text: string, file: File | null) => Promise<void>;
};

export default function SubmitHomeworkModal({
  hw,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!text.trim() && !file) return;
    setSubmitting(true);
    await onSubmit(hw.id, text, file);
    setSubmitting(false);
    setText("");
    setFile(null);
    onClose();
  }

  return (
    <div className="modal-overlay px-4">
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="section-title">
              Submit homework
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">{hw.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          {/* Instructions reminder */}
          {hw.instructions && (
            <div className="rounded-lg text-sm leading-relaxed text-gray-500">
              <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                Assignment
              </p>
              {hw.instructions}
            </div>
          )}

          {/* Written answer */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Your answer
            </label>
            <textarea
              rows={5}
              placeholder="Write your answer here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Attach a file{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            {file ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                <HiOutlineDocumentArrowUp className="h-5 w-5 shrink-0 text-emerald-600" />
                <span className="flex-1 truncate text-sm text-gray-700">
                  {file.name}
                </span>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <HiOutlineTrash size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-4 text-sm text-gray-400 hover:border-emerald-400 hover:text-emerald-600"
              >
                <HiOutlineDocumentArrowUp size={16} />
                Click to upload
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || (!text.trim() && !file)}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
