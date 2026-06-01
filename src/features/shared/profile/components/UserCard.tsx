import { Link } from "react-router-dom";

import defaultAvatar from "../../../../assets/user.png";
import type { UserNameAndAvatar } from "../../../../type/user";

export default function UserCard({
  users,
  type,
}: {
  users?: UserNameAndAvatar[];
  type: "Students" | "Instructors";
}) {
  return (
    <div>
      <div className="rounded bg-white p-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            {users?.length && type === "Students"
              ? `${users.length} students`
              : type}
          </p>
        </div>

        {users ? (
          users.map((u) => (
            <Link
              key={u.id}
              className="group flex items-center gap-4 pt-4"
              to={`/users/${u.id}`}
            >
              <img
                src={u.avatar || defaultAvatar}
                alt="avatar"
                className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
              />

              <p className="group-hover:text-blue-400">
                {u.first_name} {u.last_name}
              </p>
            </Link>
          ))
        ) : (
          <p>users are not Found</p>
        )}
      </div>
    </div>
  );
}
