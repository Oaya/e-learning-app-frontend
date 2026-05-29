import { Link } from "react-router-dom";
import type { Instructor } from "../../../../type/user";
import defaultAvatar from "../../../../assets/user.png";

export default function InstructorCard({
  instructors,
}: {
  instructors?: Instructor[];
}) {
  return (
    <div>
      <div className="rounded bg-white p-4">
        <p className="text-sm text-gray-500">Instructors</p>

        {instructors ? (
          instructors.map((ins) => (
            <Link
              className="group flex items-center gap-4 pt-4"
              to={`/users/${ins.id}`}
            >
              <img
                src={ins.avatar || defaultAvatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover group-hover:opacity-80"
              />

              <p className="group-hover:text-blue-400">
                {ins.first_name} {ins.last_name}
              </p>
            </Link>
          ))
        ) : (
          <p>Instructors are not Found</p>
        )}
      </div>
    </div>
  );
}
