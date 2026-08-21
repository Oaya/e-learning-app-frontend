import {
  HiOutlineClock,
  HiLanguage,
  HiOutlineVideoCamera,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

import type { Lesson } from "@/type/lesson";
import { LESSON_BORDER_COLOR, LESSON_STATUS_BADGE } from "@/utils/constants";
import { canJoinLesson, formatDay, formatTime } from "@/utils/helper";
import Badge from "@/ui/Badge";

export default function StudentLessonCard({ lesson }: { lesson: Lesson }) {
  const { day, mon } = formatDay(lesson.scheduled_at);
  const navigate = useNavigate();

  return (
    <div
      className={`card cursor-pointer ${LESSON_BORDER_COLOR[lesson.status]}`}
      style={{ opacity: lesson.status === "canceled" ? 0.5 : 1 }}
      onClick={() => navigate(`/student/lessons/${lesson.id}`)}
    >
      {/* Date block */}
      <div className="w-12 shrink-0 text-center">
        <div className="text-2xl leading-none font-semibold text-gray-800">
          {day}
        </div>
        <div className="text-[11px] tracking-wide text-gray-400 uppercase">
          {mon}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-16 w-px shrink-0 bg-gray-200" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-medium text-gray-800">{lesson.topic}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineClock size={16} />
            {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiLanguage size={16} />
            {lesson.language}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1 capitalize">
        <Badge status={lesson.status} constant={LESSON_STATUS_BADGE} />
        {canJoinLesson(lesson) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lessons/${lesson.id}/meeting`);
            }}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <HiOutlineVideoCamera size={16} />
            Join
          </button>
        )}

        {lesson.recording_url && lesson.status === "completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/student/lessons/${lesson.id}`);
            }}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <HiOutlineVideoCamera size={16} />
            Watch
          </button>
        )}
      </div>
    </div>
  );
}
