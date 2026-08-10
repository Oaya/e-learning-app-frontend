import {
  HiOutlinePencil,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";
import dayjs from "dayjs";
import { LuLanguages } from "react-icons/lu";

import { formatTime } from "../../../../utils/helper";
import type { Lesson } from "../../../../type/lesson";
import Badge from "../../../../ui/Badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";

type Props = {
  lesson: Lesson;
  setAddOpen: (open: boolean) => void;
};

export default function StudentLessonDetailsHeader({
  lesson,
  setAddOpen,
}: Props) {
  const scheduledAt = dayjs(lesson.scheduled_at);

  const actualMinutes = lesson.meeting_duration_in_seconds
    ? Math.round(lesson.meeting_duration_in_seconds / 60)
    : null;

  return (
    <div className="flex items-start justify-between gap-4 text-gray-400">
      <div className="space-y-2">
        {/* Title + student chip */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="page-title">
            {lesson.topic}
          </h1>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 text-sm">
            <HiOutlineCalendar size={15} />
            {scheduledAt.format("YYYY-MM-DD")}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <HiOutlineClock size={15} />
            {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1 text-sm">
            <LuLanguages size={15} />
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

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setAddOpen(true)}
          className="btn-white flex items-center gap-1.5 px-3 py-1.5"
        >
          <HiOutlinePencil size={15} />
          Update My Note
        </button>
      </div>
    </div>
  );
}
