import { HiOutlineClock, HiOutlineVideoCamera } from "react-icons/hi";
import type { Lesson } from "../../../../type/lesson";
import {
  LESSON_BORDER_COLOR,
  LESSON_STATUS_BADGE,
} from "../../../../utils/constants";
import {
  canJoinLesson,
  capitalize,
  formatDay,
  formatTime,
} from "../../../../utils/helper";
import { LuLanguages, LuVideo } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Badge from "../../../../ui/badge";
import { useState } from "react";
import WatchRecordingModal from "../../../shared/lessons/components/WatchRecordingModal";

export default function StudentLessonCard({ lesson }: { lesson: Lesson }) {
  const { day, mon } = formatDay(lesson.scheduled_at);
  const navigate = useNavigate();
  const [watchingRecording, setWatchingRecording] = useState(false);

  return (
    <div
      className={`card ${LESSON_BORDER_COLOR[lesson.status]}`}
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

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineClock size={16} />
            {formatTime(lesson.scheduled_at)} · {lesson.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <LuLanguages size={16} />
            {lesson.language}
          </span>

          {lesson.recording_url && (
            <span className="text-theme-green-20 flex items-center gap-1 text-xs">
              <HiOutlineVideoCamera size={16} />
              Recording
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          value={capitalize(lesson.status)}
          status={lesson.status}
          constant={LESSON_STATUS_BADGE}
          className="px-2 py-0.5"
        />
        {canJoinLesson(lesson) && (
          <button
            onClick={() => navigate(`/lessons/${lesson.id}/meeting`)}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <LuVideo size={16} />
            Join Lesson
          </button>
        )}

        {lesson.recording_url && (
          <button
            onClick={() => setWatchingRecording(true)}
            className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
          >
            <LuVideo size={16} />
            Watch
          </button>
        )}
      </div>

      {watchingRecording && lesson.recording_url && (
        <WatchRecordingModal
          isOpen
          onClose={() => setWatchingRecording(false)}
          recordingUrl={lesson.recording_url}
        />
      )}
    </div>
  );
}
