import { useParams } from "react-router-dom";

import { useUserCourses } from "../../../admin/dashboard/hooks/useUserCourses";
import { capitalize } from "../../../../utils/helper";
import { useUser } from "../../../admin/users/hooks/useUser";
import ProfileCoursesList from "../components/ProfileCoursesList";
import { UserModel } from "../../../../models/user";
import defaultAvatar from "../../../../assets/user.png";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserEnrollments } from "../../../student/dashboard/hooks/useUserEnrollments";

export default function UserProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const userId = id || "";
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const { user, isLoading } = useUser(userId);
  const { courses, isLoading: isCoursesLoading } = useUserCourses(userId);

  const { enrollments, isLoading: isEnrollmentLoading } = useUserEnrollments(
    authUser?.id || "",
  );

  if (!userId) return <p>User ID is missing.</p>;
  if (isAuthLoading || isLoading || isEnrollmentLoading) return <p>Loading…</p>;
  if (!user) return <p>User not found.</p>;

  const isAdmin = new UserModel(authUser).isAdmin();
  const coursesWithStAccess = new Map(
    courses?.map((course) => [course.id, { ...course, access: false }]) ?? [],
  );

  if (!isAdmin && enrollments) {
    enrollments.forEach((e) => {
      const course = coursesWithStAccess.get(e.course.id);
      if (course)
        coursesWithStAccess.set(e.course.id, { ...course, access: true });
    });
  }

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
          isAdmin={isAdmin}
          isCoursesLoading={isCoursesLoading}
          courses={[...coursesWithStAccess.values()]}
        />
      </div>
    </div>
  );
}
