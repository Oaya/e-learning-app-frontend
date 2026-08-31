import { useState } from "react";
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiLanguage,
  HiOutlineVideoCamera,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import {
  MdOutlineFreeCancellation,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import dayjs from "dayjs";

import { canJoinLesson, formatTime } from "@/utils/helper";
import type { Lesson } from "@/type/lesson";
import Badge from "@/ui/Badge";
import { LESSON_STATUS_BADGE } from "@/utils/constants";
import CancelLessonModal from "./CancelLessonModal";
import { useNavigate } from "react-router-dom";

type Props = {
  lesson: Lesson;
};

export default function StudentLessonDetailsHeader({ lesson }: Props) {
  const scheduledAt = dayjs(lesson.scheduled_at);
  const [cancelOpen, setCancelOpen] = useState(false);
  const navigate = useNavigate();

  const actualMinutes = lesson.meeting_duration_in_seconds
    ? Math.round(lesson.meeting_duration_in_seconds / 60)
    : null;

  const canCancel = lesson.status === "scheduled";

  return (
    <>
      <section className="page-header-row">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Lessons</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex gap-2">
          {canJoinLesson(lesson) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/lessons/${lesson.id}/meeting`);
              }}
              className="btn-secondary gap-1.5 px-3 py-1.5"
            >
              <HiOutlineVideoCamera size={16} />
              Join
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="btn-primary-pink"
            >
              <MdOutlineFreeCancellation size={16} />
              Cancel lesson
            </button>
          )}
        </div>
      </section>

      <div className="flex items-start justify-between gap-4 text-gray-400">
        <div className="space-y-2">
          {/* Title */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">{lesson.topic}</h1>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-sm">
              <HiOutlineCalendar size={15} />
              {scheduledAt.format("YYYY-MM-DD")}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <HiOutlineClock size={15} />
              {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes}{" "}
              min
            </span>
            <span className="flex items-center gap-1 text-sm">
              <HiLanguage size={15} />
              {lesson.language}
            </span>
            <Badge
              status={lesson.status}
              constant={LESSON_STATUS_BADGE}
              className="px-2 py-0.5"
            />
            {actualMinutes !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Actual duration: </span>
                <span className="font-medium">{actualMinutes} min</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {canCancel && (
        <CancelLessonModal
          isOpen={cancelOpen}
          lesson={lesson}
          onCancel={() => setCancelOpen(false)}
        />
      )}
    </>
  );
}
