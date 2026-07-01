import dayjs from "dayjs";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Lesson } from "../../../../type/lesson";

type UpcomingLessonPanelProps = {
  lessons?: Lesson[];
};

export default function UpcomingLessonsPanel({
  lessons,
}: UpcomingLessonPanelProps) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Upcoming lessons
        </p>
        <Link
          to="/student/lessons"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {lessons?.length === 0 ? (
        <p className="text-sm text-gray-400">No upcoming lessons.</p>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          {lessons?.map((s) => {
            const dt = dayjs(s.scheduled_at);
            return (
              <div key={s.id} className="flex items-center gap-4 py-3">
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
                    {dt.format("h:mm A")} · {s.duration_in_minutes} min
                  </p>
                  <p className="text-xs text-gray-400">{s.topic}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  Scheduled
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
