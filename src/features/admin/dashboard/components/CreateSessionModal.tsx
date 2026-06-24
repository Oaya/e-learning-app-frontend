import { useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdNumber, fdString } from "../../../../utils/formData";
import { useAlert } from "../../../../contexts/AlertContext";
import CustomSelect from "../../../../ui/CustomSelect";
import type { User } from "../../../../type/user";
import type { Session } from "../../../../type/session";
import { useSessions } from "../../sessions/hooks/useSessions";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students?: User[];
  sessions?: Session[];
  timezone?: string;
};

const duration = [30, 60, 90, 120];

export default function CreateSessionModal({
  isOpen,
  onClose,
  students,
  sessions,
  timezone,
}: ModalProps) {
  const alert = useAlert();
  const { createSession, isCreating } = useSessions({
    onCreateSuccess: () => {
      alert.success("Session created successfully.");
      onClose();
    },
  });
  const [date, setDate] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(30);

  const tz = timezone ?? dayjs.tz.guess();

  const bookedDates = useMemo(() => {
    return (sessions ?? [])
      .filter((s) => s.status === "scheduled")
      .map((s) => {
        const d = dayjs.utc(s.scheduled_at).tz(tz);
        return new Date(d.year(), d.month(), d.date());
      });
  }, [sessions, tz]);

  const filterTime = (time: Date) => {
    const newStart = dayjs(time);
    if (newStart.isBefore(dayjs())) return false;
    const newEnd = newStart.add(selectedDuration, "minute");
    return !(sessions ?? [])
      .filter((s) => s.status === "scheduled")
      .some((s) => {
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

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        student_id: fdString(formData, "student"),
        topic: fdString(formData, "topic"),
        duration_in_minutes: fdNumber(formData, "duration") as number,
        scheduled_at: date,
      };

      createSession(data);
    } catch {
      alert.error("Failed to create session. Try again later.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">
            Create Session With Student
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-6">
          <div className="mb-4">
            <label className="sm-label">Student</label>
            <CustomSelect
              name="student"
              withAvatar
              options={(students ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
              }))}
            />
          </div>

          <div className="mb-4">
            <label className="sm-label">Topic</label>
            <input name="topic" type="text" required className="form-input" />
          </div>

          <div className="grid grid-cols-2 gap-6">
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
                className="form-input w-full"
              />
            </div>

            <div className="mb-4">
              <label className="sm-label">Duration</label>
              <CustomSelect
                name="duration"
                type="number"
                options={duration.map((d) => ({
                  value: d,
                  label: `${d} min`,
                }))}
                value={{
                  value: selectedDuration,
                  label: `${selectedDuration} min`,
                }}
                onChange={(opt: { value: number }) =>
                  setSelectedDuration(opt.value)
                }
              />
            </div>
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
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
