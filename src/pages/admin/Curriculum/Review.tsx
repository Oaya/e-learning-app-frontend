import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useCourseOverview } from "../../../hooks/useCourseOverview";
import { useAlert } from "../../../contexts/AlertContext";
import { publishCourse } from "../../../api/courses";

export default function CourseReview() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const alert = useAlert();
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

  const mutation = useMutation({
    mutationFn: (id: string) => publishCourse(id),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      navigate(`/admin/courses/${courseId}`);
    },
    onError: (error) => {
      alert.error(
        error instanceof Error ? error.message : "Failed to publish course",
      );
    },
  });

  const handleSubmitCourse = () => {
    mutation.mutate(courseId);
  };

  //Check if it can submit the course or not. to submit course, it must have at least one section with one lesson.
  if (!id) return <p>Invalid course</p>;
  const message =
    course &&
    (!course.sections ||
      course.sections.length === 0 ||
      course.sections.every(
        (section) => !section.lessons || section.lessons.length === 0,
      ))
      ? "Course must have at least one section with one lesson to be submitted for review."
      : "";

  if (isLoading) return <p>Loading…</p>;
  return (
    <div>
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">Course Review</h1>
      </header>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      {course ? (
        <div className="text-md w-180 text-gray-500">
          <table className="mb-6 w-full border-collapse text-left">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="border-r border-gray-300 px-4 py-2 font-semibold">
                  Title
                </td>
                <td className="px-4 py-2">{course.title}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="border-r border-gray-300 px-4 py-2 font-semibold">
                  Description
                </td>
                <td className="px-4 py-2">{course.description}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="border-r border-gray-300 px-4 py-2 font-semibold">
                  Category
                </td>
                <td className="px-4 py-2">{course.category}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="border-r border-b border-gray-300 px-4 py-2 font-semibold">
                  Level
                </td>
                <td className="px-4 py-2">{course.level}</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="border-r border-b border-gray-300 px-4 py-2 font-semibold">
                  Price
                </td>
                <td className="px-4 py-2">
                  $ {course.price ? Number(course.price).toFixed(2) : ""}
                </td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="border-r border-b border-gray-300 px-4 py-2 font-semibold">
                  Status
                </td>
                <td className="px-4 py-2">
                  {course.published ? "Published" : "Draft"}
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            {course.sections.map((section) => (
              <div key={section.id}>
                <div className="bg-c-purple/20 mb-2 flex items-center justify-between rounded border border-gray-300 p-3 text-gray-500">
                  <div className="flex flex-1 items-center justify-between">
                    <p className="font-semibold">{section.title}</p>

                    <span
                      onClick={() => toggleOpenSection(section.id)}
                      className="cursor-pointer"
                    >
                      <AiOutlineDown fontSize={18} />
                    </span>
                  </div>
                </div>

                {openSection === section.id && (
                  <div className="mb-4 py-3 text-sm text-gray-600">
                    <p className="px-3">{section.description}</p>
                    {section.lessons?.map((lesson) => {
                      const expanded = !!expandedLessons[lesson.id];
                      const desc = lesson.description ?? "";
                      const isLong = desc.length > 80; // tweak threshold

                      return (
                        <div
                          key={lesson.id}
                          className="mt-4 rounded border border-gray-200 p-3 text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="">{lesson.title}</span>

                              <span className="bg-c-light-yellow ml-4 rounded-full px-2 py-0.5 text-xs font-medium text-white">
                                {lesson.lesson_type}
                              </span>
                            </div>
                            <div>
                              <p>
                                {lesson.duration_in_seconds
                                  ? `${lesson.duration_in_seconds} seconds`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          {desc && (
                            <>
                              <p
                                className={`mt-1 text-sm text-gray-500 ${
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
                            </>
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
      ) : (
        <></>
      )}

      <div className="mt-6">
        <Link
          to={`/admin/courses/${id}/pricing`}
          className="curriculum-back-button"
        >
          Back
        </Link>
        <button
          type="submit"
          onClick={handleSubmitCourse}
          disabled={mutation.isPending || !!message}
          className="primary-submit-button"
        >
          {mutation.isPending ? "Saving..." : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}
