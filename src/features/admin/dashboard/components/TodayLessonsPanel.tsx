import { HiArrowRight, HiCalendar } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Lesson } from "../../../../type/lesson";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { User } from "../../../../type/user";
import { SESSION_STATUS_BADGE } from "../../../../utils/constants";
import { capitalize } from "../../../../utils/helper";
dayjs.extend(utc);
dayjs.extend(timezone);

type TodayLessonPanelProps = {
  user: User;
  lessons: Lesson[];
};

export default function TodayLessonsPanel({
  user,
  lessons,
}: TodayLessonPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <HiCalendar className="h-4 w-4" /> Today's lessons
        </h2>
        <Link
          to="/admin/lessons"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {lessons?.map((s) => (
          <div key={s.id} className="flex items-start gap-3 py-2.5">
            <span className="w-20 shrink-0 pt-0.5 text-xs text-gray-400">
              {dayjs
                .utc(s.scheduled_at)
                .tz(user?.timezone ?? dayjs.tz.guess())
                .format("h:mm A")}{" "}
              -{" "}
              {dayjs
                .utc(s.scheduled_at)
                .add(s.duration_in_minutes, "minute")
                .tz(user?.timezone ?? dayjs.tz.guess())
                .format("h:mm A")}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {s.student.first_name} {s.student.first_name}
              </p>
              <p className="text-xs text-gray-400">{s.topic}</p>
            </div>

            <span
              className={`rounded-full bg-emerald-50 px-2 py-0.5 text-xs ${SESSION_STATUS_BADGE[s.status]}`}
            >
              {capitalize(s.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
