import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "../../../../utils/formData";
import { useAlert } from "../../../../contexts/AlertContext";
import CustomSelect from "../../../../ui/CustomSelect";
import type { Session } from "../../../../type/session";
import { useSessions } from "../hooks/useSessions";
import { useUsers } from "../../students/hooks/useUsers";
import { HiOutlineX } from "react-icons/hi";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type StudentOption = {
  value: string;
  label: string;
  avatar?: string | null;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "Create" | "Edit";
  session?: Session;
  sessions?: Session[];
  timezone?: string;
};

const DURATIONS = [30, 60, 90, 120];

export default function UpsertSessionModal({
  isOpen,
  onClose,
  type,
  session,
  sessions,
  timezone,
}: ModalProps) {
  const alert = useAlert();
  const { users: students } = useUsers({});
  const { createSession, isCreating, updateSession, isUpdating } = useSessions({
    onCreateSuccess: () => {
      alert.success("Session created successfully.");
      onClose();
    },
    onUpdateSuccess: () => {
      alert.success("Session updated successfully.");
      onClose();
    },
  });

  const tz = timezone ?? dayjs.tz.guess();

  const [date, setDate] = useState<Date | null>(
    session ? dayjs.utc(session.scheduled_at).tz(tz).toDate() : null,
  );
  const [selectedDuration, setSelectedDuration] = useState(
    session?.duration_in_minutes ?? 30,
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    session
      ? {
          value: session.student.id,
          label: `${session.student.first_name} ${session.student.last_name}`,
          avatar: session.student.avatar,
        }
      : null,
  );

  // Exclude the session being edited from conflict detection
  const conflictSessions = useMemo(() => {
    return (sessions ?? []).filter(
      (s) => s.status === "scheduled" && s.id !== session?.id,
    );
  }, [sessions, session]);

  const bookedDates = useMemo(() => {
    return conflictSessions.map((s) => {
      const d = dayjs.utc(s.scheduled_at).tz(tz);
      return new Date(d.year(), d.month(), d.date());
    });
  }, [conflictSessions, tz]);

  const filterTime = (time: Date) => {
    const newStart = dayjs(time);
    if (newStart.isBefore(dayjs())) return false;
    const newEnd = newStart.add(selectedDuration, "minute");
    return !conflictSessions.some((s) => {
      const existingStart = dayjs.utc(s.scheduled_at).tz(tz);
      const existingEnd = existingStart.add(s.duration_in_minutes, "minute");
      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    });
  };

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!date) {
      alert.error("Please select a date.");
      return;
    }
    if (!selectedStudent) {
      alert.error("Please select a student.");
      return;
    }

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        student_id: selectedStudent.value,
        topic: fdString(formData, "topic"),
        duration_in_minutes: selectedDuration,
        scheduled_at: date,
        note: fdString(formData, "note"),
      };

      if (type === "Edit" && session) {
        await updateSession({ id: session.id, data });
      } else {
        await createSession(data);
      }
    } catch {
      alert.error("Failed to save session. Try again later.");
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            {type === "Create" ? "Create New" : "Edit"} Session
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Student */}
          <div className="mb-4">
            <label className="sm-label">Student</label>
            <CustomSelect
              name="student"
              withAvatar
              value={selectedStudent}
              onChange={(opt: StudentOption | null) => setSelectedStudent(opt)}
              options={(students ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
              }))}
            />
          </div>

          {/* Date + time */}
          <div className="mb-4">
            <label className="sm-label">Date</label>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              excludeDates={bookedDates}
              filterTime={filterTime}
              placeholderText="Select date & time"
              wrapperClassName="w-full"
              className="form-input w-full"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="sm-label">Duration</label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDuration(d)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                    selectedDuration === d
                      ? "border-theme-yellow-20 text-theme-yellow-20 bg-theme-yellow-10"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div className="mb-4">
            <label className="sm-label">Topic</label>
            <input
              name="topic"
              type="text"
              required
              defaultValue={session?.topic ?? ""}
              className="form-input"
            />
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="sm-label">
              Note <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              name="note"
              rows={3}
              defaultValue={session?.note ?? ""}
              placeholder="Preparation notes, goals for this session…"
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary-pink"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? type === "Edit"
                  ? "Saving..."
                  : "Creating..."
                : type === "Edit"
                  ? "Save Changes"
                  : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
