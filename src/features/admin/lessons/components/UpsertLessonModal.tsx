import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "@/utils/formData";
import { useAlert } from "@/contexts/AlertContext";
import CustomSelect from "@/ui/CustomSelect";
import type { Lesson, LessonStatusType } from "@/type/lesson";
import { useLessons } from "@/features/admin/lessons/hooks/useLessons";
import { useUsers } from "@/features/admin/students/hooks/useUsers";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import type { StudentOption, User } from "@/type/user";
import { lessonDuration, LessonStatus } from "@/utils/constants";
import { capitalize } from "@/utils/helper";

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "Create" | "Edit";
  student?: User;
  lesson?: Lesson;
  lessons?: Lesson[];
  timezone?: string;
};

export default function UpsertLessonModal({
  isOpen,
  onClose,
  type,
  lesson,
  student,
  lessons,
  timezone,
}: ModalProps) {
  const alert = useAlert();
  const { users: students } = useUsers({});
  const { createLesson, isCreating, updateLesson, isUpdating } = useLessons();

  const selectableStudent = students?.filter((s) => s.status === "active");

  const tz = timezone ?? dayjs.tz.guess();

  const [date, setDate] = useState<Date | null>(
    lesson ? dayjs.utc(lesson.scheduled_at).tz(tz).toDate() : null,
  );
  const [selectedDuration, setSelectedDuration] = useState(
    lesson?.duration_in_minutes ?? 30,
  );

  const lData = lesson ? lesson.student : student ? student : null;
  const defaultLanguage = lesson ? lesson.language : null;
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    lData
      ? {
          value: lData.id,
          label: `${lData.first_name} ${lData.last_name}`,
          avatar: lData.avatar,
          language_levels: lData.language_levels,
        }
      : null,
  );

  // Exclude the lesson being edited from conflict detection
  const conflictLessons = useMemo(() => {
    return (lessons ?? []).filter(
      (l) => l.status === "scheduled" && l.id !== lesson?.id,
    );
  }, [lessons, lesson]);

  const filterTime = (time: Date) => {
    const newStart = dayjs(time);
    if (newStart.isBefore(dayjs())) return false;
    const newEnd = newStart.add(selectedDuration, "minute");
    return !conflictLessons.some((s) => {
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
        language: fdString(formData, "language"),
        scheduled_at: date,
        teacher_note: fdString(formData, "teacher_note"),
        status: fdString(formData, "status") as LessonStatusType,
      };

      if (type === "Edit" && lesson) {
        await updateLesson({ id: lesson.id, data });
      } else {
        await createLesson(data);
      }
      onClose();
    } catch {
      // handled by the mutation's onError
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === "Create" ? "Create New" : "Edit"} Lesson`}
      maxWidth="max-w-xl"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="modal-body">
        {/* Student */}
        <div className="grid-cols-2 md:grid md:gap-3">
          <FormField label="Student">
            <CustomSelect
              name="student"
              withAvatar
              isDisabled={!!lData}
              value={selectedStudent}
              onChange={(opt: StudentOption | null) => setSelectedStudent(opt)}
              options={(selectableStudent ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
                language_levels: i.language_levels,
              }))}
            />
          </FormField>

          <FormField label="Language">
            <CustomSelect
              name="language"
              className="form-select capitalize"
              defaultValue={
                defaultLanguage
                  ? {
                      value: defaultLanguage,
                      label: defaultLanguage,
                    }
                  : undefined
              }
              options={selectedStudent?.language_levels?.map((ll) => ({
                value: ll.language,
                label: ll.level ? `${ll.language} · ${ll.level}` : ll.language,
              }))}
            />
          </FormField>
        </div>

        {/* Date + time */}
        <div className="grid-cols-2 md:grid md:gap-3">
          <FormField label="Date">
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              filterTime={filterTime}
              placeholderText="Select date & time"
              wrapperClassName="w-full"
              className="form-input w-full max-sm:mb-4"
            />
          </FormField>

          <FormField label="Lesson Status">
            <CustomSelect
              name="status"
              className="capitalize"
              defaultValue={
                lesson?.status
                  ? {
                      value: lesson.status,
                      label: capitalize(lesson.status),
                    }
                  : undefined
              }
              options={Object.entries(LessonStatus).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
            />
          </FormField>
        </div>

        {/* Duration */}
        <FormField label="Duration">
          <div className="flex gap-2">
            {lessonDuration.map((d) => (
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
        </FormField>

        {/* Topic */}
        <FormField label="Topic">
          <input
            name="topic"
            type="text"
            required
            defaultValue={lesson?.topic ?? ""}
            className="form-input"
          />
        </FormField>

        {/* Notes */}
        <FormField label="Teacher Note" optional>
          <textarea
            name="teacher_note"
            rows={3}
            defaultValue={lesson?.teacher_note ?? ""}
            placeholder="Preparation notes, goals for this lesson…"
            className="form-textarea"
          />
        </FormField>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-primary-white">
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
                : "Create Lesson"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
