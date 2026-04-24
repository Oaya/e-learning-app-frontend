import { useNavigate, useParams } from "react-router-dom";

import CourseDetailTable from "../../../shared/profile/components/CourseDetailTable";
import InstructorCard from "../../../shared/profile/components/InstructorCard";
import SectionDetails from "../../../admin/curriculum/components/sections/SectionDetails";

import { useCourseOverview } from "../../../admin/curriculum/hooks/useCourseOverview";
import { useUserEnrollmentStatus } from "../hooks/useUserEnrollmentStatus";
import { useAuth } from "../../../../contexts/AuthContext";
import { useCourseStartMutation } from "../hooks/enrollmentStatusUpdateMutation";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const { user } = useAuth();
  const navigate = useNavigate();

  const { course, isLoading } = useCourseOverview(courseId);
  const { enrollment } = useUserEnrollmentStatus(user?.id ?? "", courseId);

  if (isLoading || !course) return <p>Loading…</p>;

  const { startEnrollmentMutation, isStarting } = useCourseStartMutation(
    enrollment?.enrollment.id ?? "",
    {
      onStartSuccess: () => {
        navigate(`/courses/${course.id}/lessons/${accessLessonId}`);
      },
    },
  );

  const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id ?? "";
  const accessLessonId =
    enrollment?.enrollment.last_accessed_lesson_id ?? firstLessonId;

  const handleStartOrContinue = async () => {
    if (!enrollment) return;

    // If user is enrolled but hasn't started, start the course
    if (enrollment.enrollment.status === "enrolled") {
      // Call API to start the course and create lesson progresses
      await startEnrollmentMutation();
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-4 rounded-md bg-gray-200 p-4 pr-36">
            <img
              src={course.thumbnail ?? "/src/assets/placeholder.webp"}
              alt={course.title}
              className="h-24 w-40 rounded-md object-cover"
            />

            <div className="min-w-0">
              <h1 className="truncate text-3xl font-semibold">
                {course.title}
              </h1>
              <p className="text-sm text-gray-500">
                {course.published ? "Published" : "Draft"}
              </p>
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
                <SectionDetails key={section.id} section={section} />
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
