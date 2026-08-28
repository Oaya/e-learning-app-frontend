import { HiArrowRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import type { StudentWithStatues } from "@/type/user";

import defaultAvatar from "@/assets/user.png";

type AllStudentPanelProps = {
  students: StudentWithStatues[];
};

export default function AllStudentPanel({ students }: AllStudentPanelProps) {
  const navigate = useNavigate();
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-header">All students</h2>
        <Link to="/admin/students" className="view-all">
          Manage <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {students?.length === 0 ? (
        <div className="no-content text-center max-sm:m-5">
          No students yet.{" "}
          <Link to="/admin/students" className="text-theme-green-20 underline">
            Create Student
          </Link>
        </div>
      ) : (
        <div className="cursor-pointer divide-y divide-gray-100">
          {students?.slice(0, 6).map((student) => {
            return (
              <div
                key={student.id}
                className="flex items-center gap-3 py-2.5"
                onClick={() => navigate(`/users/${student.id}`)}
              >
                <img
                  src={student.avatar || defaultAvatar}
                  alt="avatar"
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {student.first_name} {student.last_name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
