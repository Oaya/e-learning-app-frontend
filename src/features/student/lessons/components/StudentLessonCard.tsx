import dayjs from "dayjs";
import { HiOutlineClock, HiOutlineVideoCamera } from "react-icons/hi";

import type { Lesson } from "../../../../type/lesson";
import {
  LESSON_BORDER_COLOR,
  LESSON_STATUS_BADGE,
} from "../../../../utils/constants";
import { formatDay } from "../../../../utils/helper";
import { LuLanguages } from "react-icons/lu";

export default function StudentLessonCard({ lesson }: { lesson: Lesson }) {
  const { day, mon } = formatDay(lesson.scheduled_at);
  const dt = dayjs(lesson.scheduled_at);

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${LESSON_BORDER_COLOR[lesson.status]}`}
      style={{ opacity: lesson.status === "canceled" ? 0.7 : 1 }}
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
      <div className="h-14 w-px shrink-0 bg-gray-200" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-sm font-medium text-gray-800">
          {lesson.topic}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineClock size={16} />
            {dt.format("h:mm A")} · {lesson.duration_in_minutes} min
          </span>
          {lesson.status === "completed" ? (
            <span className="text-theme-green-20 flex items-center gap-1 text-xs">
              <HiOutlineVideoCamera size={16} />
              Recording available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <LuLanguages size={16} />
              {lesson.language}
            </span>
          )}
        </div>

        {lesson.note && (
          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-500">
            {lesson.note}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ${LESSON_STATUS_BADGE[lesson.status]}`}
        >
          {lesson.status}
        </span>
        {lesson.status === "completed" && (
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <HiOutlineVideoCamera size={16} />
            Watch
          </button>
        )}
      </div>
    </div>
  );
}
