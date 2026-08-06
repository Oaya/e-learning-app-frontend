import dayjs from "dayjs";
import { useState } from "react";

import Badge from "../../../../ui/Badge";
import { LESSON_STATUS_BADGE } from "../../../../utils/constants";
import type { Lesson } from "../../../../type/lesson";
import UpsertLessonModal from "../../lessons/components/UpsertLessonModal";
import { useAuth } from "../../../../contexts/AuthContext";
import type { User } from "../../../../type/user";

type Props = {
  lessons: Lesson[] | undefined;
  user: User | undefined;
};

export default function LessonsPanel({ lessons, user }: Props) {
  const { user: authUser } = useAuth();
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);

  return (
    <div className="panel-box min-w-0 flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header mb-4">Lessons</p>
        <button
          onClick={() => setIsCreateLessonOpen(true)}
          className="btn-white px-2 py-1"
        >
          + New
        </button>
      </div>

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
                  {dayjs(lesson.scheduled_at).format("YYYY-MM-DD")}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {dayjs(lesson.scheduled_at).format("h:mm A")}
                  {lesson.topic ? ` · ${lesson.topic}` : ""}
                </p>
              </div>
              <Badge
                status={lesson.status}
                constant={LESSON_STATUS_BADGE}
                className="px-2 py-0.5 text-[12px]"
              />
            </div>
          ))}
        </div>
      )}

      <UpsertLessonModal
        isOpen={isCreateLessonOpen}
        onClose={() => setIsCreateLessonOpen(false)}
        type="Create"
        student={user}
        lessons={lessons}
        timezone={authUser?.timezone}
      />
    </div>
  );
}
