import { Link } from "react-router-dom";
import type { Course } from "../../type/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <section
      key={course.id}
      className="mx-auto mt-10 mb-5 grid grid-cols-1 justify-between gap-x-14 gap-y-20 md:grid-cols-2 lg:grid-cols-4"
    >
      <div className="w-62 rounded-xl bg-white shadow-md duration-500 hover:scale-105 hover:shadow-xl">
        <a href="#">
          <img
            src={course.thumbnail_url ?? "/src/assets/placeholder.webp"}
            alt={course.title}
            className="h-40 w-62 rounded-t-xl object-cover"
          />
          <div className="w-62 px-4 pt-3">
            <div className="flex items-center-safe justify-between">
              <p className="block truncate text-lg font-bold text-black capitalize">
                {course.title}
              </p>

              <Link
                to={`/admin/courses/${course.id}/course-builder`}
                className="text-center text-sm text-blue-600"
              >
                Edit
              </Link>
            </div>

            <div className="flex justify-between">
              <p className="my-3 cursor-auto text-sm font-semibold text-gray-400">
                {course.published ? "Published" : "Draft"}
              </p>
              <p className="my-3 cursor-auto text-sm text-gray-400">
                created:{" "}
                {course.created_at
                  ? new Date(course.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
