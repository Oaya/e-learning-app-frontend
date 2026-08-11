import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "../../../../utils/formData";

import type { LessonStatusType } from "../../../../type/lesson";

import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import ModalShell from "../../../../ui/ModalShell";
import FormField from "../../../../ui/FormField";

import { useLesson } from "@/features/shared/lessons/hooks/useLesson";
import { useState } from "react";
import { addLessonRecording } from "../../../../api/lesson_recordings";
import { capitalize } from "@/utils/helper";
import { TbLock, TbUsers } from "react-icons/tb";

const END_STATUSES: LessonStatusType[] = ["completed", "no_show", "canceled"];

dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  durationInSeconds: number;
  recordingBlob?: Blob | null;
};

export default function CompleteLessonModal({
  isOpen,
  onClose,
  lessonId,
  durationInSeconds,
  recordingBlob,
}: ModalProps) {
  const { lesson, endingLesson, isEnding } = useLesson(lessonId);
  const [loading, setLoading] = useState(false);
  const [shareNote, setShareNote] = useState(lesson?.note_shared ?? false);

  const hasNotes = !!lesson?.meeting_note;

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Read the form data synchronously — e.currentTarget is nulled out by the
    // DOM once the event finishes propagating, so it can't be read after an await.
    const formData = new FormData(e.currentTarget);
    setLoading(true);

    try {
      // Upload recording
      if (recordingBlob) {
        const video = new File([recordingBlob], "lesson.webm", {
          type: "video/webm",
        });

        await addLessonRecording(lessonId, {
          video,
          durationInSeconds,
          fileSize: recordingBlob.size,
        });
      }

      const data = {
        meeting_duration_in_seconds: durationInSeconds,
        status: fdString(formData, "status") as LessonStatusType,
        meeting_feedback: fdString(formData, "meeting_feedback"),
        ...(hasNotes && { note_shared: shareNote }),
      };

      await endingLesson({ id: lessonId, data });
      onClose();
    } catch {
      // handled by the mutation's onError
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="End Lesson"
      maxWidth="max-w-xl"
    >
      <div className="px-6 pt-5">
        <p className="mb-4 text-lg text-gray-500">
          {lesson?.topic} ·{" "}
          <span>
            {lesson?.student.first_name} {lesson?.student.last_name}
          </span>
        </p>

        <div className="flex gap-8">
          <div>
            <p className="text-gray-500">Duration</p>
            <p className="font-semibold">
              {dayjs.utc(durationInSeconds * 1000).format("mm:ss")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Scheduled</p>
            <p className="font-semibold">{lesson?.duration_in_minutes} min</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold">
              {lesson?.scheduled_at &&
                dayjs(lesson.scheduled_at).format("YYYY-MM-DD")}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="modal-body">
        {/* status */}
        <FormField label="Lesson Status" className="mb-4">
          <div className="flex gap-2">
            {END_STATUSES.map((s) => (
              <label key={s} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  defaultChecked={
                    lesson ? lesson.status === s : s === "completed"
                  }
                  className="peer sr-only"
                />
                <span
                  className={`block rounded-lg border border-gray-200 py-2 text-center text-xs font-medium opacity-40 transition peer-checked:border-transparent peer-checked:opacity-100 hover:opacity-75 ${LESSON_STATUS_BADGE[s]}`}
                >
                  {capitalize(s)}
                </span>
              </label>
            ))}
          </div>
        </FormField>

        {/* feedback */}
        <FormField label="Meeting Feedback" optional className="mb-4">
          <textarea
            name="meeting_feedback"
            rows={3}
            defaultValue={lesson?.meeting_feedback ?? ""}
            placeholder="What did we cover? Any observation about student's progress..."
            className="form-textarea"
          />
        </FormField>

        {/* Share notes — only shown if teacher wrote notes */}
        {hasNotes && (
          <FormField label="Share lesson notes with student?">
            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => setShareNote(true)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition ${
                  shareNote
                    ? "border-theme-purple-50 bg-theme-purple-50/10 text-theme-purple-50"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                <TbUsers size={15} />
                Share with student
              </button>
              <button
                type="button"
                onClick={() => setShareNote(false)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition ${
                  !shareNote
                    ? "border-gray-500 bg-gray-50 text-gray-700"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                <TbLock size={15} />
                Keep private
              </button>
            </div>
          </FormField>
        )}

        <div className="mb-4"></div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary-white mr-4"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary-pink"
            disabled={loading || isEnding}
          >
            {loading || isEnding ? "Saving..." : "Save & Finish"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
