import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import placeholderImg from "../../../../assets/placeholder.webp";

import ConfirmModal from "../../../../ui/DeleteConfirmModal";

import SectionDetails from "../components/sections/SectionDetails";
import { useCourse } from "../hooks/useCourseMutation";
import { useCourseOverview } from "../hooks/useCourseOverview";
import CourseDetailTable from "../../../shared/profile/components/CourseDetailTable";
import UserCard from "../../../shared/profile/components/UserCard";
import { useCourseEnrollments } from "../hooks/useCourseEnrollments";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { course, isLoading } = useCourseOverview(courseId);
  const { enrollments, isLoading: isCourseEnrollmentLoading } =
    useCourseEnrollments(courseId);
  const { deleteCourse, isDeleting } = useCourse(courseId, {
    onDeleteSuccess: () => {
      navigate("/admin/dashboard");
    },
  });

  //TODO: Need to add getting Total Student Number.
  console.log(enrollments);

  if (isLoading || !course || isCourseEnrollmentLoading) return <p>Loading…</p>;

  return (
    <div>
      <ConfirmModal
        isOpen={isOpen}
        isSubmitting={isDeleting}
        message="Are you sure you want to delete this? This action cannot be undone."
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          if (!courseId) return;
          setIsOpen(false);
          deleteCourse();
        }}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-4 rounded-md bg-gray-200 p-4 pr-36">
            <img
              src={course.thumbnail ?? placeholderImg}
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

          {/* Top-right actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Link
              to={`/admin/courses/${course.id}/course-builder`}
              className="btn-primary"
            >
              Edit
            </Link>

            <button
              type="button"
              className="btn-primary bg-theme-pink-20 hover:bg-theme-pink-20/80"
              onClick={() => setIsOpen(true)}
            >
              Delete
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
            <UserCard users={course.instructors} type="Instructors" />

            <UserCard
              users={enrollments?.flatMap((e) => e.user)}
              type="Students"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
