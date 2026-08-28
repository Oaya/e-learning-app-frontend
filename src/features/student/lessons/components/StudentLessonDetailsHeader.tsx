import { useState } from "react";
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiLanguage,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { MdOutlineFreeCancellation } from "react-icons/md";
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

        {/* Cancel button */}

        <div className="flex shrink-0 gap-2">
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
              className="btn-primary-pink gap-1.5 px-3 py-1.5"
            >
              <MdOutlineFreeCancellation size={16} />
              Cancel lesson
            </button>
          )}
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
