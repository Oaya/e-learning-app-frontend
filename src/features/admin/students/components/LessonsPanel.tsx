import dayjs from "dayjs";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import Badge from "@/ui/Badge";
import { LESSON_STATUS_BADGE } from "@/utils/constants";
import type { Lesson } from "@/type/lesson";
import UpsertLessonModal from "@/features/admin/lessons/components/UpsertLessonModal";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/type/user";

type Props = {
  lessons: Lesson[] | undefined;
  user: User | undefined;
};

export default function LessonsPanel({ lessons, user }: Props) {
  const { user: authUser } = useAuth();
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="panel-box min-w-0 flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header mb-4">Lessons</p>

        <div className="flex items-center justify-between gap-4">
          <Link to={`/admin/students/${user!.id}/lessons`} className="view-all">
            View all <HiArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setIsCreateLessonOpen(true)}
            className="btn-white px-2 py-1"
          >
            + New
          </button>
        </div>
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
              className="flex cursor-pointer items-center justify-between py-2.5"
              onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
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
