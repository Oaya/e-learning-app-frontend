import { Link } from "react-router-dom";
import type { Course } from "../../../../type/course";

export default function ProfileCoursesList({
  isCoursesLoading,
  courses,
  role,
}: {
  role: string;
  isCoursesLoading: boolean;
  courses?: Course[];
}) {
  let title = "Courses";

  if (role === "instructor") {
    title = "Instructing Courses";
  } else if (role === "student") {
    title = "Enrolled Courses";
  }

  return (
    <div className="col-span-4 mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
      <h3 className="text-xl font-semibold">{title}</h3>

      {isCoursesLoading && <p>Loading courses…</p>}

      {!isCoursesLoading && courses?.length === 0 && (
        <p className="text-gray-500">No courses</p>
      )}

      <ul>
        {courses?.map((c) => (
          <Link
            key={c.id}
            to={
              role === "admin" ? `/admin/courses/${c.id}` : `/courses/${c.id}`
            }
            className="w-full text-left disabled:cursor-not-allowed"
          >
            <li className="my-4 flex justify-between rounded border border-gray-200 p-3">
              <div className="flex gap-2">
                <p className="font-medium">{c.title}</p>
              </div>

              <span
                className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium text-white ${c.published ? "bg-theme-green-10" : "bg-theme-pink-20"}`}
              >
                {c.published ? "Published" : "Draft"}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
