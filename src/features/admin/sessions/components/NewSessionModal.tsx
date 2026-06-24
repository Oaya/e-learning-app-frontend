import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { useUsers } from "../../students/hooks/useUsers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSessionData) => void;
};

export type NewSessionData = {
  student_id: string;
  scheduled_at: string;
  duration_in_minutes: number;
  topic: string;
  notes: string;
};

const DURATIONS = [30, 45, 60, 90, 120];

export default function NewSessionModal({ isOpen, onClose, onSubmit }: Props) {
  const { users } = useUsers({});
  const students = (users ?? []).filter((u) => u.role === "student");

  const [form, setForm] = useState<NewSessionData>({
    student_id: "",
    scheduled_at: "",
    duration_in_minutes: 60,
    topic: "",
    notes: "",
  });

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "duration_in_minutes" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">New session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Student */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Student</label>
            <select
              name="student_id"
              required
              value={form.student_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select a student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date + time */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Date & time</label>
            <input
              type="datetime-local"
              name="scheduled_at"
              required
              value={form.scheduled_at}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Duration</label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, duration_in_minutes: d }))}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                    form.duration_in_minutes === d
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Topic</label>
            <input
              type="text"
              name="topic"
              required
              placeholder="e.g. Past tense revision"
              value={form.topic}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Notes <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Preparation notes, goals for this session…"
              value={form.notes}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Book session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
