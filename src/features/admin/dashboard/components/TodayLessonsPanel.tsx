import { HiArrowRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import type { Lesson } from "../../../../type/lesson";
import dayjs from "dayjs";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import Badge from "../../../../ui/Badge";
import { canJoinLesson, formatTime } from "../../../../utils/helper";
import { LuVideo } from "react-icons/lu";

type TodayLessonPanelProps = {
  lessons: Lesson[];
};

export default function TodayLessonsPanel({ lessons }: TodayLessonPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-header">Today's lessons</h2>
        <Link to="/admin/lessons" className="view-all">
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {lessons?.map((l) => (
          <div key={l.id} className="flex items-center gap-3 py-2.5">
            <span className="w-20 shrink-0 pt-0.5 text-xs text-gray-400">
              {formatTime(l.scheduled_at)} -{" "}
              {dayjs(l.scheduled_at)
                .add(l.duration_in_minutes, "minute")
                .format("h:mm A")}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {l.student.first_name} {l.student.last_name}
              </p>
              <p className="text-xs text-gray-400">{l.topic}</p>
            </div>

            <div className="flex flex-col items-end">
              <Badge
                status={l.status}
                constant={LESSON_STATUS_BADGE}
                className="items-center px-1 py-0.5 text-[11px]"
              />

              {canJoinLesson(l) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/lessons/${l.id}/meeting`);
                  }}
                  className="btn-white mt-2 flex items-center gap-1 px-1 py-0.5 text-[11px]"
                >
                  <LuVideo size={14} />
                  Join Lesson
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
