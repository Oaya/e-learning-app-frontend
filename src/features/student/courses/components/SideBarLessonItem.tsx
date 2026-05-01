import { Link } from "react-router-dom";
import type { Lesson } from "../../../../type/lesson";

type LessonItemProps = {
  lesson: Lesson;
  courseId: string;
  isActive: boolean;
  lessonProgressId?: string;
  isCompleted: boolean;
  isUpdating: boolean;
  onUpdate: (payload: { lessonProgressId: string; isCompleted: boolean }) => void;
};

export default function LessonItem({
  lesson,
  courseId,
  isActive,
  lessonProgressId,
  isCompleted,
  isUpdating,
  onUpdate,
}: LessonItemProps) {
  function handleCheckboxClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function handleCheckboxChange() {
    if (lessonProgressId) onUpdate({ lessonProgressId, isCompleted });
  }

  return (
    <li>
      <Link
        to={`/courses/${courseId}/lessons/${lesson.id}`}
        className={`flex items-center rounded px-3 py-1.5 text-sm ${
          isActive
            ? "bg-theme-purple-10 text-theme-purple-20 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className="flex-1">{lesson.title}</span>
        {lessonProgressId && (
          <input
            type="checkbox"
            checked={isCompleted}
            disabled={isUpdating}
            onClick={handleCheckboxClick}
            onChange={handleCheckboxChange}
            className="custom-checkbox"
          />
        )}
      </Link>
    </li>
  );
}
