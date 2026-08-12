import dayjs from "dayjs";
import { HiArrowRight } from "react-icons/hi2";
import { LuVideo } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import type { Lesson } from "@/type/lesson";
import { LESSON_STATUS_BADGE } from "@/utils/constants";
import Badge from "@/ui/Badge";
import { canJoinLesson } from "@/utils/helper";

type UpcomingLessonPanelProps = {
  lessons?: Lesson[];
};

export default function UpcomingLessonsPanel({
  lessons,
}: UpcomingLessonPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header">Upcoming lessons</p>
        <Link to="/student/lessons" className="view-all">
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {lessons?.length === 0 ? (
        <p className="text-center text-sm text-gray-400 italic max-sm:m-5">
          No upcoming lessons.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {lessons?.map((l) => {
            const dt = dayjs(l.scheduled_at);
            return (
              <div key={l.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-10 text-center">
                  <p className="text-lg leading-none font-semibold text-gray-800">
                    {dt.format("D")}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    {dt.format("MMM")}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {dt.format("h:mm A")} · {l.duration_in_minutes} min
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
            );
          })}
        </div>
      )}
    </div>
  );
}
