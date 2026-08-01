import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";

import { fdString } from "../../../../utils/formData";

import type { LessonStatusType } from "../../../../type/lesson";

import { HiOutlineX } from "react-icons/hi";

import { LESSON_STATUS_BADGE, LessonStatus } from "../../../../utils/constants";

import { useLesson } from "../hooks/useLesson";
import { useState } from "react";
import { addLessonRecording } from "../../../../api/lesson_recordings";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">End Lesson</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
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
                  dayjs(lesson.scheduled_at).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* status */}
          <div className="mb-4">
            <label className="sm-label">Lesson Status</label>
            <div className="flex gap-2">
              {(
                Object.entries(LessonStatus) as [LessonStatusType, string][]
              ).map(([key, label]) => (
                <label key={key} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={key}
                    defaultChecked={
                      lesson ? lesson.status === key : key === "completed"
                    }
                    className="peer sr-only"
                  />
                  <span
                    className={`block rounded-lg border border-gray-200 py-2 text-center text-xs font-medium opacity-40 transition peer-checked:border-transparent peer-checked:opacity-100 hover:opacity-75 ${LESSON_STATUS_BADGE[key]}`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* feedback */}
          <div className="mb-4">
            <label className="sm-label">
              Meeting Feedback <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              name="meeting_feedback"
              rows={3}
              // defaultValue={lesson?.note ?? ""}
              placeholder="What did we cover? Any observation about student's progress..."
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
              type="submit"
              className="btn-primary-pink"
              disabled={loading || isEnding}
            >
              {loading || isEnding ? "Saving..." : "Save & Finish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
