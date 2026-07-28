import dayjs from "dayjs";

import { capitalize } from "../../../../utils/helper";
import Badge from "../../../../ui/badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import type { Lesson } from "../../../../type/lesson";

type Props = {
  lessons: Lesson[] | undefined;
};

export default function LessonsPanel({ lessons }: Props) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-5">
      <p className="panel-header mb-4">Lessons</p>
      {lessons?.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No lessons yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {lessons?.slice(0, 6).map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {dayjs(lesson.scheduled_at).format("MMM D, YYYY")}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {dayjs(lesson.scheduled_at).format("h:mm A")}
                  {lesson.topic ? ` · ${lesson.topic}` : ""}
                </p>
              </div>
              <Badge
                value={capitalize(lesson.status)}
                status={lesson.status}
                constant={LESSON_STATUS_BADGE}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
