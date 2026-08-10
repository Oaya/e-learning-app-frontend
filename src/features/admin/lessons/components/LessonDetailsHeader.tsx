import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";
import dayjs from "dayjs";
import { LuLanguages, LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";

import { formatTime, requireStatusChange } from "../../../../utils/helper";
import type { Lesson } from "../../../../type/lesson";
import Badge from "../../../../ui/Badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import defaultAvatar from "../../../../assets/user.png";

type Props = {
  lesson: Lesson;
  setEditOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
};

export default function LessonDetailsHeader({
  lesson,
  setEditOpen,
  setDeleteOpen,
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
          <h1 className="text-xl font-semibold text-gray-800">
            {lesson.topic}
          </h1>
          <Link
            to={`/users/${lesson.student.id}`}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pr-3 pl-1 text-xs font-medium text-gray-700 hover:border-gray-300"
          >
            <span className="flex items-center gap-1.5 text-xs">
              <img
                src={lesson.student.avatar || defaultAvatar}
                alt="avatar"
                className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
              />{" "}
              {lesson.student.first_name} {lesson.student.last_name}{" "}
            </span>
            <LuExternalLink size={11} className="" />
          </Link>

          {requireStatusChange(lesson) && (
            <p className="truncate text-sm font-medium text-red-400">
              This lesson is in the past but is still marked as scheduled.
              Update its status.
            </p>
          )}
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
          onClick={() => setEditOpen(true)}
          className="btn-white flex items-center gap-1.5 px-3 py-1.5"
        >
          <HiOutlinePencil size={15} />
          Edit
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="btn-primary-pink flex items-center gap-1.5 px-3 py-1.5"
        >
          <HiOutlineTrash size={15} />
          Delete
        </button>
      </div>
    </div>
  );
}
