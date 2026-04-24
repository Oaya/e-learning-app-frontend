import { Link, useNavigate, useParams } from "react-router-dom";

import SectionDetails from "../components/sections/SectionDetails";
import { useCourseOverview } from "../hooks/useCourseOverview";
import { useCourse } from "../hooks/useCourseMutation";
import CourseDetailTable from "../../../shared/profile/components/CourseDetailTable";

export default function CourseReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const { course, isLoading } = useCourseOverview(courseId);

  const { submitCourseMutation, isSubmittingCourse } = useCourse(courseId, {
    onSubmitCourseSuccess: () => {
      navigate(`/admin/courses/${courseId}`);
    },
  });

  const handleSubmitCourse = async () => {
    await submitCourseMutation();
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
    <div className="curriculum-container">
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
        <Link to={`/admin/courses/${id}/pricing`} className="btn-primary-white">
          Back
        </Link>
        <button
          type="submit"
          onClick={handleSubmitCourse}
          disabled={isSubmittingCourse || !!message}
          className="btn-primary"
        >
          {isSubmittingCourse ? "Saving..." : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}
