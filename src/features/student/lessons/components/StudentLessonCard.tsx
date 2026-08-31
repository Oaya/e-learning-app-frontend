import {
  HiOutlineClock,
  HiLanguage,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Lesson } from "@/type/lesson";
import { LESSON_BORDER_COLOR, LESSON_STATUS_BADGE } from "@/utils/constants";
import { canJoinLesson, formatDay, formatTime } from "@/utils/helper";
import Badge from "@/ui/Badge";
import ActionBtn from "@/ui/ActionButton";
import CancelLessonModal from "./CancelLessonModal";

export default function StudentLessonCard({ lesson }: { lesson: Lesson }) {
  const { day, mon } = formatDay(lesson.scheduled_at);
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div
      className={`card cursor-pointer ${LESSON_BORDER_COLOR[lesson.status]}`}
      style={{ opacity: lesson.status === "canceled" ? 0.5 : 1 }}
      onClick={() => navigate(`/student/lessons/${lesson.id}`)}
    >
      {/* Date block */}
      <div className="shrink-0 text-center xl:w-12">
        <div className="text-2xl leading-none font-semibold text-gray-800">
          {day}
        </div>
        <div className="text-[11px] tracking-wide text-gray-400 uppercase">
          {mon}
        </div>
      </div>

      {/* Divider */}
      <div className="mr-4 ml-2 h-18 w-px shrink-0 bg-gray-200 xl:mx-4 xl:h-14" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">
          {lesson.topic}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3 md:flex-nowrap">
          <span className="flex shrink-0 items-center gap-1 text-xs whitespace-nowrap text-gray-400">
            <HiOutlineClock size={16} />
            {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiLanguage size={16} />
            {lesson.language}
          </span>
        </div>
      </div>

      {canJoinLesson(lesson) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/lessons/${lesson.id}/meeting`);
          }}
          className="btn-white mt-2 mr-4 hidden gap-1 px-2 py-1.5 lg:inline-flex"
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
          className="btn-white mt-2 mr-4 hidden gap-1 px-2 py-1.5 lg:inline-flex"
        >
          <HiOutlineVideoCamera size={16} />
          Watch
        </button>
      )}

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge
          status={lesson.status}
          constant={LESSON_STATUS_BADGE}
          className="px-2 py-0.5"
        />

        {/* Actions */}
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <>
            {lesson.status === "scheduled" && (
              <ActionBtn title="Cancel" onClick={() => setCancelOpen(true)}>
                <MdOutlineFreeCancellation size={15} />
              </ActionBtn>
            )}

            <ActionBtn
              title="Message to Teacher"
              onClick={() =>
                window.open(`mailto:${lesson.admin.email}`, "_blank")
              }
            >
              <LuMessageSquareText size={15} />
            </ActionBtn>
          </>
        </div>

        {canJoinLesson(lesson) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lessons/${lesson.id}/meeting`);
            }}
            className="btn-white inline-flex gap-1 px-2 py-1.5 lg:hidden"
          >
            <HiOutlineVideoCamera size={16} />
            Join
          </button>
        )}

        {lesson.recording_url && lesson.status === "completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lessons/lessons/${lesson.id}`);
            }}
            className="btn-white inline-flex gap-1 px-2 py-1.5 lg:hidden"
          >
            <HiOutlineVideoCamera size={16} />
            Watch
          </button>
        )}
      </div>

      {cancelOpen && (
        <CancelLessonModal
          isOpen={cancelOpen}
          lesson={lesson}
          onCancel={() => setCancelOpen(false)}
        />
      )}
    </div>
  );
}
