import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { StudentWithStatues } from "../../../../type/user";
import { ADMIN_HW_STATUS_BADGE } from "../../../../utils/constants";
import defaultAvatar from "../../../../assets/user.png";
import { capitalize } from "@/utils/helper";

function PayDot({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Paid
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Owed
    </span>
  );
}

type AllStudentPanelProps = {
  students: StudentWithStatues[];
};

export default function AllStudentPanel({ students }: AllStudentPanelProps) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-header">All students</h2>
        <Link
          to="/admin/students"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          Manage <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {students?.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No students yet.{" "}
          <Link to="/admin/students" className="text-theme-green-20 underline">
            Create Student
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {students?.map((student) => {
            return (
              <div key={student.id} className="flex items-center gap-3 py-2.5">
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
                <div className="flex shrink-0 flex-col items-end gap-0.5 capitalize">
                  {student.hw_status && (
                    <span
                      className={`rounded-full ${ADMIN_HW_STATUS_BADGE[student.hw_status]} px-1 py-0.5 text-[11px]`}
                    >
                      {` HW ${capitalize(student.hw_status)}`}
                    </span>
                  )}

                  <PayDot paid={false} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
