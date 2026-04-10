import { GoPencil } from "react-icons/go";
import { useParams } from "react-router-dom";

import { useUserCourses } from "../../../admin/dashboard/hooks/useUserCourses";
import { capitalize } from "../../../../utils/helper";
import { useUser } from "../../../admin/users/hooks/useUser";
import CourseCard from "../../../admin/curriculum/components/courses/CourseCard";
import CoursesCard from "../components/coursesCard";

export default function UserProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const userId = id || "";

  const { user, isLoading } = useUser(userId);
  const { courses, isLoading: isCoursesLoading } = useUserCourses(userId);

  if (!userId) return <p>User ID is missing.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold">Profile</h2>
      <div className="grid grid-cols-7 gap-10">
        <div className="col-span-3 mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
          <div className="flex justify-center">
            <div className="group relative h-32 w-32">
              <img
                src={user.avatar || "/src/assets/user.png"}
                alt="avatar"
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="">
            <div className="text-center">
              <div className="mb-2">
                <p className="text-theme-purple-20">
                  <span>{capitalize(user.role) ?? "-"}</span>
                </p>
                <p className="text-2xl">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div className="mb-2">
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="mb-2"></div>
            </div>
          </div>
        </div>

        {/* course */}

        <CoursesCard isCoursesLoading={isCoursesLoading} courses={courses} />

        <div className="col-span-4 mt-3 space-y-6 rounded border border-gray-300 bg-white p-6">
          <h3 className="text-xl font-semibold">Courses</h3>

          {isCoursesLoading && <p>Loading courses…</p>}

          {!isCoursesLoading && courses?.length === 0 && (
            <p className="text-gray-500">No courses</p>
          )}

          <ul className="space-y-2">
            {courses?.map((c) => (
              <li key={c.id} className="rounded border p-3">
                <p className="font-medium">{c.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
