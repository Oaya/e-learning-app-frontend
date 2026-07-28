import { HiArrowRight, HiCalendar } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Lesson } from "../../../../type/lesson";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { User } from "../../../../type/user";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import { capitalize } from "../../../../utils/helper";
import Badge from "../../../shared/profile/components/badge";
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
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <HiCalendar size={16} /> Today's lessons
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
                {s.student.first_name} {s.student.last_name}
              </p>
              <p className="text-xs text-gray-400">{s.topic}</p>
            </div>

            <Badge
              value={capitalize(s.status)}
              status={s.status}
              constant={LESSON_STATUS_BADGE}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
