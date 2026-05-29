import { useParams } from "react-router-dom";

import { useUserCourses } from "../../../admin/dashboard/hooks/useUserCourses";
import { capitalize } from "../../../../utils/helper";
import { useUser } from "../../../admin/users/hooks/useUser";
import ProfileCoursesList from "../components/ProfileCoursesList";
import { UserModel } from "../../../../models/user";
import defaultAvatar from "../../../../assets/user.png";

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
                src={user.avatar || defaultAvatar}
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
                <p className="text-2xl">{new UserModel(user).fullName()}</p>
              </div>

              <div className="mb-2">
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="mb-2"></div>
            </div>
          </div>
        </div>

        {/* course */}

        <ProfileCoursesList
          isCoursesLoading={isCoursesLoading}
          courses={courses}
        />
      </div>
    </div>
  );
}
