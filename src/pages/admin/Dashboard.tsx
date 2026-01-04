import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Later replace with real API data
  const stats = {
    courses: 4,
    students: 128,
    enrollments: 312,
  };

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
          <p className="text-sm text-gray-500">Course</p>
          <p className="mt-1 text-2xl font-semibold">{stats.courses}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-gray-500">Students</p>
          <p className="mt-1 text-2xl font-semibold">{stats.students}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-gray-500">Enrollments</p>
          <p className="mt-1 text-2xl font-semibold">{stats.enrollments}</p>
        </div>
      </div>

      {/* Courses overview */}
      <section>
        <h2 className="mb-4 text-lg font-medium">Your courses</h2>

        <div className="divide-y rounded border bg-white">
          <CourseRow id="1" title="Intro to Web Development" published />
          <CourseRow id="2" title="Advanced React Patterns" published={false} />
        </div>

        <Link
          to="/admin/courses"
          className="mt-3 inline-block text-sm text-blue-600"
        >
          View all courses →
        </Link>
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
