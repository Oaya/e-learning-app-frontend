import { useCourses } from "../../../hooks/useCourses";
import CourseCard from "../../../components/admin/courses/CourseCard";

export default function CoursesList() {
  const { courses } = useCourses();

  if (!courses || courses.length === 0) {
    return <div className="p-6">No courses available.</div>;
  }

  return (
    <div>
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">Your Courses</h1>
      </header>

      <div className="mx-auto mt-10 mb-5 grid grid-cols-1 justify-between gap-x-14 gap-y-20 rounded md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
