import { useParams } from "react-router-dom";
import { marked } from "marked";

marked.use({ breaks: true, gfm: true });

import { useCourseOverview } from "../../../admin/curriculum/hooks/useCourseOverview";
import { useUserEnrollmentStatus } from "../hooks/useUserEnrollmentStatus";
import { useAuth } from "../../../../contexts/AuthContext";
import CourseSideBar from "../components/CourseSideBar";

// Inserts a visible <br> for each blank line, but skips content inside code fences
function addVisibleLineBreaks(content: string): string {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, i) =>
      i % 2 === 0 ? part.replace(/\n\n/g, "\n\n<br />\n\n") : part,
    )
    .join("");
}

export default function LessonPage() {
  const { id: courseId = "", lessonId = "" } = useParams<{
    id: string;
    lessonId: string;
  }>();
  const { user } = useAuth();

  if (!user) return <p>Please log in to view the lesson.</p>;

  const { course, isLoading: courseLoading } = useCourseOverview(courseId);
  const { enrollment, isLoading: enrollmentLoading } = useUserEnrollmentStatus(
    user.id,
    courseId,
  );

  if (courseLoading || enrollmentLoading) return <p>Loading…</p>;
  if (!course) return <p>Course not found.</p>;

  const currentLesson = course.sections
    .flatMap((s) => s.lessons ?? [])
    .find((l) => l.id === lessonId);

  if (!currentLesson) return <p>Lesson not found.</p>;

  const isReading = currentLesson.lesson_type === "reading";

  return (
    <div className="flex h-full gap-6">
      {/* Main content */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Video area — hidden for reading lessons */}
        {!isReading && (
          <div className="h-[67vh] w-full rounded-md bg-black">
            {currentLesson.video ? (
              <video
                src={currentLesson.video}
                controls
                className="h-full w-full rounded-md object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white">
                No video available
              </div>
            )}
          </div>
        )}

        {/* Article content */}
        {currentLesson.article && (
          <div
            className="prose h-[67vh] max-w-none overflow-y-auto border border-gray-300 p-4"
            dangerouslySetInnerHTML={{
              __html: marked(
                addVisibleLineBreaks(currentLesson.article),
              ) as string,
            }}
          />
        )}

        {/* Lesson info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{currentLesson.title}</h1>
          {currentLesson.description && (
            <p className="text-gray-500">{currentLesson.description}</p>
          )}
        </div>
      </div>

      {/* Sidebar – course outline */}
      <CourseSideBar
        course={course}
        enrollment={enrollment}
        lessonId={lessonId}
        userId={user.id}
      />
    </div>
  );
}
