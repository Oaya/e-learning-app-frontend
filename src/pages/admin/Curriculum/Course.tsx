import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCourseOverview } from "../../../hooks/useCourseOverview";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useCourse } from "../../../hooks/useCourse";

import SectionDetails from "../../../components/admin/sections/SectionDetails";
import CourseDetailTable from "../../../components/admin/courses/CourseDetailTable";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { course, isLoading } = useCourseOverview(courseId);
  const { deleteCourse, isDeleting } = useCourse(courseId, {
    onDeleteSuccess: () => {
      navigate("/admin/");
    },
  });

  if (isLoading || !course) return <p>Loading…</p>;

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
              src={course.thumbnail_url ?? "/src/assets/placeholder.webp"}
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
              className="btn-primary bg-c-pink hover:bg-c-pink/80"
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
            <div className="rounded bg-white p-4">
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="mt-1 text-2xl font-semibold">Instructor Info</p>
            </div>

            <div className="rounded bg-white p-4">
              <p className="text-sm text-gray-500">Students</p>
              <p className="mt-1 text-2xl font-semibold">
                Total Student Number
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
