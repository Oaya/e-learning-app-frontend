import { useNavigate, useParams } from "react-router-dom";
import placeholderImg from "../../../../assets/placeholder.webp";

import CourseDetailTable from "../../../shared/profile/components/CourseDetailTable";
import InstructorCard from "../../../shared/profile/components/InstructorCard";
import SectionDetails from "../../../admin/curriculum/components/sections/SectionDetails";

import { useCourseOverview } from "../../../admin/curriculum/hooks/useCourseOverview";
import { useUserEnrollmentStatus } from "../hooks/useUserEnrollmentStatus";
import { useAuth } from "../../../../contexts/AuthContext";
import { useCourseStartMutation } from "../hooks/useCourseStartMutation";

export default function CoursePage() {
  const { id: courseId = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { course, isLoading } = useCourseOverview(courseId);
  const { enrollment } = useUserEnrollmentStatus(user?.id ?? "", courseId);

  const { startEnrollmentMutation, isStarting } = useCourseStartMutation(
    enrollment?.enrollment.id ?? "",
    {
      onStartSuccess: () => {
        navigate(`/courses/${course?.id}/lessons/${accessLessonId}`);
      },
    },
  );

  if (isLoading || !course) return <p>Loading…</p>;

  const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id ?? "";
  const accessLessonId =
    enrollment?.enrollment.last_accessed_lesson_id ?? firstLessonId;

  const handleStartOrContinue = async () => {
    if (!enrollment) return;

    if (enrollment.enrollment.status === "enrolled") {
      await startEnrollmentMutation();
    } else {
      navigate(`/courses/${courseId}/lessons/${accessLessonId}`);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-4 rounded-md bg-gray-200 p-4 pr-36">
            <img
              src={course.thumbnail ?? placeholderImg}
              alt={course.title}
              className="h-24 w-40 rounded-md object-cover"
            />

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-semibold">
                {course.title}
              </h1>
              <p className="text-sm text-gray-500">
                {course.published ? "Published" : "Draft"}
              </p>
              {enrollment && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{enrollment.progress_percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
                    <div
                      className="bg-theme-purple-40 h-full rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top-right actions
          if enrollment status is enrolled, show start Course and if not, show continue Course */}

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleStartOrContinue}
              disabled={isStarting}
              className="btn-primary"
            >
              {enrollment?.enrollment.status === "enrolled"
                ? "Start Course"
                : "Continue Course"}
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_1fr]">
          {/* Left column */}
          <div className="space-y-6 text-gray-500">
            <CourseDetailTable course={course} />
            {/* Sections */}
            <div className="space-y-3">
              {course.sections.map((section) => (
                <SectionDetails
                  key={section.id}
                  section={section}
                  lessonProgresses={enrollment?.lesson_progresses}
                />
              ))}
            </div>
          </div>

          {/* Right column (sidebar) */}
          <div className="flex flex-col space-y-6 lg:sticky lg:top-6">
            <InstructorCard instructors={course.instructors} />
          </div>
        </div>
      </div>
    </div>
  );
}
