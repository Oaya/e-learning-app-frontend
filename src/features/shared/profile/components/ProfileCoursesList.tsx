import { useNavigate } from "react-router-dom";
import type { Course } from "../../../../type/course";

export default function ProfileCoursesList({
  isCoursesLoading,
  courses,
  isAdmin,
}: {
  isAdmin: boolean;
  isCoursesLoading: boolean;
  courses?: (Course & { access: boolean })[];
}) {
  const navigate = useNavigate();

  return (
    <div className="col-span-4 mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
      <h3 className="text-xl font-semibold">Courses</h3>

      {isCoursesLoading && <p>Loading courses…</p>}

      {!isCoursesLoading && courses?.length === 0 && (
        <p className="text-gray-500">No courses</p>
      )}

      <ul>
        {courses?.map((c) => {
          const to = isAdmin
            ? `/admin/courses/${c.id}`
            : c.access
              ? `/courses/${c.id}`
              : null;

          return (
            <button
              key={c.id}
              disabled={!to}
              className="w-full text-left disabled:cursor-not-allowed"
              onClick={() => to && navigate(to)}
            >
              <li
                className={`my-4 flex justify-between rounded border border-gray-200 p-3 ${!to ? "bg-gray-300" : ""}`}
              >
                <div className="flex gap-2">
                  <p className="font-medium">{c.title}</p>
                  {!to ? (
                    <p className="text-red-500">( No access to this course )</p>
                  ) : null}
                </div>

                <span
                  className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium text-white ${c.published ? "bg-theme-green-10" : "bg-theme-pink-20"}`}
                >
                  {c.published ? "Published" : "Draft"}
                </span>
              </li>
            </button>
          );
        })}
      </ul>
    </div>
  );
}
