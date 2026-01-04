import { Link } from "react-router-dom";
import { useCoursesData } from "../../hooks/useCoursesData";

export default function AdminDashboard() {
  const { courses } = useCoursesData();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <Link
          to="/admin/courses/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-gray-500">Courses</p>
          <p className="mt-1 text-2xl font-semibold">{courses?.length ?? 0}</p>
        </div>
      </div>

      {/* Courses overview */}
      <section>
        {courses && courses.length > 0 ? (
          <>
            <h2 className="mb-4 text-lg font-medium">Your courses</h2>

            <div className="divide-y rounded border bg-white">
              <CourseRow id="1" title="Intro to Web Development" published />
              <CourseRow
                id="2"
                title="Advanced React Patterns"
                published={false}
              />
            </div>

            <Link
              to="/admin/courses"
              className="mt-3 inline-block text-sm text-blue-600"
            >
              View all courses →
            </Link>
          </>
        ) : (
          <p>You don't have any courses</p>
        )}
      </section>
    </div>
  );
}

type CourseRowProps = {
  id: string;
  title: string;
  published: boolean;
};

function CourseRow({ id, title, published }: CourseRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">
          {published ? "Published" : "Draft"}
        </p>
      </div>

      <Link to={`/admin/courses/${id}`} className="text-sm text-blue-600">
        Edit
      </Link>
    </div>
  );
}
