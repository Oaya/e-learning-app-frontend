import { useCourseOverview } from "../../hooks/useCourseOverview";

export default function CourseOverview({ id }: { id?: string }) {
  const courseId = id ?? "";
  const { course } = useCourseOverview(courseId);
  return (
    <div className="border-gray-300 p-4">
      <h2 className="text-center text-xl font-semibold">Overview</h2>
      {course ? (
        <div className="text-md text-gray-600">
          <p className="font-semibold">
            Title:
            <span className="ml-2 font-normal"> {course.title}</span>
          </p>
          <p className="font-semibold">
            Description:
            <span className="ml-2 font-normal"> {course.description}</span>
          </p>
          <p className="font-semibold">
            Category:
            <span className="ml-2 font-normal"> {course.category}</span>
          </p>
          <p className="font-semibold">
            Level:
            <span className="ml-2 font-normal"> {course.level}</span>
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
