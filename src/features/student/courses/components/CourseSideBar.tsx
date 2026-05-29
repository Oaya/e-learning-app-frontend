import type { UserEnrollmentWithStatus } from "../../../../type/enrollment";
import type { CourseOverview } from "../../../../type/course";
import { useLessonProgressMutation } from "../hooks/useLessonProgressMutation";
import LessonItem from "./SideBarLessonItem";

type CourseSideBarProps = {
  course: CourseOverview;
  enrollment?: UserEnrollmentWithStatus;
  lessonId?: string;
  userId: string;
};

export default function CourseSideBar({
  course,
  enrollment,
  lessonId,
  userId,
}: CourseSideBarProps) {
  const { updateLessonProgress, pendingLessonProgressId } = useLessonProgressMutation(
    userId,
    course.id,
  );

  return (
    <aside className="w-72 shrink-0 space-y-3 overflow-y-auto">
      <h2 className="font-semibold">{course.title}</h2>

      {enrollment && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{enrollment.progress_percentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-theme-purple-40 h-full rounded-full transition-all"
              style={{ width: `${enrollment.progress_percentage}%` }}
            />
          </div>
        </div>
      )}

      {course.sections.map((section) => (
        <div key={section.id}>
          <p className="text-sm font-medium text-gray-700">{section.title}</p>
          <ul className="mt-1 space-y-1">
            {(section.lessons ?? []).map((lesson) => {
              const lessonProgress = enrollment?.lesson_progresses?.find(
                (lp) => lp.lesson_id === lesson.id,
              );
              return (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  courseId={course.id}
                  isActive={lesson.id === lessonId}
                  lessonProgressId={lessonProgress?.id}
                  isCompleted={lessonProgress?.status === "completed"}
                  isUpdating={pendingLessonProgressId === lessonProgress?.id}
                  onUpdate={updateLessonProgress}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
