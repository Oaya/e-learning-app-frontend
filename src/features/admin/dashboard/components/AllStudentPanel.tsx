import { HiArrowRight, HiUsers } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { User } from "../../../../type/user";
import { initials } from "../../../../utils/helper";

function HwBadge({ hw }: { hw: string }) {
  if (hw === "done")
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
        HW done
      </span>
    );
  if (hw === "due")
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
        HW due
      </span>
    );
  return (
    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
      Overdue
    </span>
  );
}

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

const STUDENT_META: Record<number, { hw: string; paid: boolean }> = {
  0: { hw: "done", paid: true },
  1: { hw: "due", paid: false },
  2: { hw: "done", paid: true },
  3: { hw: "overdue", paid: false },
};

type AllStudentPanelProps = {
  students: User[];
};

export default function AllStudentPanel({ students }: AllStudentPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <HiUsers className="h-4 w-4" /> All students
        </h2>
        <Link
          to="/admin/students"
          className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
        >
          Manage <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {students?.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No students yet.{" "}
          <Link to="/admin/students" className="text-emerald-600 underline">
            CreateSession one
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {students?.map((student, i) => {
            const meta = STUDENT_META[i % 4] ?? { hw: "done", paid: true };

            return (
              <div key={student.id} className="flex items-center gap-3 py-2.5">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-theme-purple-30 text-theme-purple-50 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {initials(student.first_name, student.last_name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {student.first_name} {student.last_name}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <HwBadge hw={meta.hw} />
                  <PayDot paid={meta.paid} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
