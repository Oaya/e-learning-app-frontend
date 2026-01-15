import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useCourseOverview } from "../../../hooks/useCourseOverview";
import { useAlert } from "../../../contexts/AlertContext";
import { publishCourse } from "../../../api/courses";
import CourseDetailTable from "../../../components/admin/CourseDetailTable";
import SectionDetails from "../../../components/admin/SectionDetails";

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
        <div className="text-md text-gray-500">
          <div className="space-y-6 text-gray-500">
            <CourseDetailTable course={course} />

            {/* Sections */}
            <div className="space-y-3">
              {course.sections.map((section) => (
                <SectionDetails key={section.id} section={section} />
              ))}
            </div>
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
