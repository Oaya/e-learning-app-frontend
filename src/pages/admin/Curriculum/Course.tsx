import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";

import { useCourseOverview } from "../../../hooks/useCourseOverview";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const { course, isLoading } = useCourseOverview(courseId);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<
    Record<string, boolean>
  >({});

  const toggleOpenSection = (sectionId: string) =>
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  if (isLoading || !course) return <p>Loading…</p>;

  return (
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
            <h1 className="truncate text-3xl font-semibold">{course.title}</h1>
            <p className="text-sm text-gray-500">
              {course.published ? "Published" : "Draft"}
            </p>
          </div>
        </div>

        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Link
            to={`/admin/courses/${course.id}`}
            className="primary-submit-button"
          >
            Edit
          </Link>

          <button
            type="button"
            className="primary-submit-button bg-c-pink hover:bg-c-pink/80"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_1fr]">
        {/* Left column */}
        <div className="space-y-6 text-gray-500">
          {/* Details table */}
          <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
                    Description
                  </td>
                  <td className="px-4 py-3">{course.description}</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
                    Category
                  </td>
                  <td className="px-4 py-3">{course.category}</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
                    Level
                  </td>
                  <td className="px-4 py-3">{course.level}</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
                    Price
                  </td>
                  <td className="px-4 py-3">
                    ${course.price ? Number(course.price).toFixed(2) : ""}
                  </td>
                </tr>

                <tr>
                  <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
                    Created At
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.created_at).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {course.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-md border border-gray-200 bg-white"
              >
                {/* Section header */}
                <button
                  type="button"
                  onClick={() => toggleOpenSection(section.id)}
                  className="bg-c-purple/10 flex w-full items-center justify-between rounded-md px-4 py-3 text-left"
                >
                  <span className="font-semibold text-gray-600">
                    {section.title}
                  </span>
                  <AiOutlineDown fontSize={18} />
                </button>

                {/* Section body */}
                {openSection === section.id && (
                  <div className="space-y-3 p-4 text-sm text-gray-600">
                    {section.description && (
                      <p className="text-gray-500">{section.description}</p>
                    )}

                    {section.lessons?.map((lesson) => {
                      const expanded = !!expandedLessons[lesson.id];
                      const desc = lesson.description ?? "";
                      const isLong = desc.length > 80;

                      return (
                        <div
                          key={lesson.id}
                          className="rounded border border-gray-200 bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-gray-700">
                                  {lesson.title}
                                </span>

                                <span className="bg-c-light-yellow rounded-full px-2 py-0.5 text-xs font-medium text-white">
                                  {lesson.lesson_type}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-xs text-gray-500">
                              {lesson.duration_in_seconds
                                ? `${lesson.duration_in_seconds} seconds`
                                : ""}
                            </div>
                          </div>

                          {desc && (
                            <div className="mt-2">
                              <p
                                className={`text-sm text-gray-500 ${
                                  expanded ? "" : "line-clamp-1"
                                }`}
                              >
                                {desc}
                              </p>

                              {isLong && (
                                <button
                                  type="button"
                                  onClick={() => toggleLesson(lesson.id)}
                                  className="text-c-purple mt-1 text-xs font-medium hover:underline"
                                >
                                  {expanded ? "Show less" : "Show more"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
            <p className="mt-1 text-2xl font-semibold">Total Student Number</p>
          </div>
        </div>
      </div>
    </div>
  );
}
