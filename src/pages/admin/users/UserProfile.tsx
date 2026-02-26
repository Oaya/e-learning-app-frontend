import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { useParams } from "react-router-dom";

import UpdatePasswordModal from "../../../components/ui/UpdatePasswordModal";
import { useUser } from "../../../hooks/useUser";
import { useUserCourses } from "../../../hooks/useUserCourses";
import { capitalize } from "../../../utils/helper";

export default function UserProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const userId = id || "";

  const { user, isLoading } = useUser(userId);
  const { courses, isLoading: isCoursesLoading } = useUserCourses(userId);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!userId) return <p>User ID is missing.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
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

              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <GoPencil className="text-2xl text-white" />
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
          <div className="">
            <div className="text-center">
              <div className="mb-2">
                <p className="text-2xl">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div className="mb-2">
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="mb-2">
                <p>
                  User Role <span>{capitalize(user.role) ?? "-"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* course */}

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
