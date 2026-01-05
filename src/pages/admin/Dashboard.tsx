import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";

export default function AdminDashboard() {
  const { courses } = useCourses();

  return (
    <div>
      <header className="flex h-14 items-center justify-between pb-10">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </header>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Link
            to="/admin/courses/new"
            className="bg-c-pink hover:bg-c-pink rounded px-4 py-2 text-sm text-white"
          >
            + New Course
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded bg-white p-4">
            <p className="text-sm text-gray-500">Courses</p>
            <p className="mt-1 text-2xl font-semibold">
              {courses?.length ?? 0}
            </p>
          </div>
        </div>

        <section>
          {courses && courses.length > 0 ? (
            <>
              <h2 className="mb-4 text-lg font-medium">Your courses</h2>

              <div className="divide-y rounded bg-white">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        {course.published ? "Published" : "Draft"}
                      </p>
                    </div>

                    <Link
                      to={`/admin/courses/${course.id}`}
                      className="text-sm text-blue-600"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
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
    </div>
  );
}
