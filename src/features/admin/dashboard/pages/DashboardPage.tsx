import { Link } from "react-router-dom";
import {
  HiUsers,
  HiCalendar,
  HiDocumentText,
  HiCreditCard,
} from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUsers } from "../../students/hooks/useUsers";
import StatCard from "../components/StatCard";
import { greeting } from "../../../../utils/helper";

const MOCK_SESSIONS = [
  {
    id: "1",
    time: "10:00",
    student: "Sara K.",
    topic: "Past tense revision",
    status: "done" as const,
  },
  {
    id: "2",
    time: "2:00 pm",
    student: "Marco R.",
    topic: "Conversation practice",
    status: "upcoming" as const,
  },
  {
    id: "3",
    time: "4:30 pm",
    student: "Yuki T.",
    topic: "Vocabulary — food",
    status: "upcoming" as const,
  },
  {
    id: "4",
    time: "6:00 pm",
    student: "Lena M.",
    topic: "Reading comprehension",
    status: "hw_due" as const,
  },
];

type SessionStatus = "done" | "upcoming" | "hw_due";

function SessionStatusBadge({ status }: { status: SessionStatus }) {
  if (status === "done")
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
        Done
      </span>
    );
  if (status === "upcoming")
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
        Upcoming
      </span>
    );
  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
      HW due
    </span>
  );
}

function SessionDot({ status }: { status: SessionStatus }) {
  const color =
    status === "done"
      ? "bg-gray-300"
      : status === "upcoming"
        ? "bg-emerald-500"
        : "bg-amber-400";
  return <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

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

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users: students } = useUsers({});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting()},{" "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
        </div>
        <Link
          to="/admin/sessions"
          className="bg-theme-purple-50 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + New session
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 p-10 lg:grid-cols-4">
        <StatCard
          icon={<HiUsers size={20} className="text-theme-yellow-20" />}
          label="Students"
          value={students ? students?.length : 0}
          sub="+1 this month"
          subColor
        />
        <StatCard
          icon={<HiCalendar size={20} className="text-theme-yellow-20" />}
          label="Sessions today"
          value={MOCK_SESSIONS.length}
          sub="Next at 2:00 pm"
        />
        <StatCard
          icon={<HiDocumentText size={20} className="text-theme-yellow-20" />}
          label="Homework pending"
          value={5}
          sub="2 overdue"
        />
        <StatCard
          icon={<HiCreditCard size={20} className="text-theme-yellow-20" />}
          label="Unpaid sessions"
          value="$240"
          sub="Across 3 students"
        />
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-4 p-10 lg:grid-cols-2">
        {/* Today sessions */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <HiCalendar className="h-4 w-4" /> Today's sessions
            </h2>
            <Link
              to="/admin/sessions"
              className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
            >
              View all <HiArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_SESSIONS.map((s) => (
              <div key={s.id} className="flex items-start gap-3 py-2.5">
                <span className="w-14 shrink-0 pt-0.5 text-xs text-gray-400">
                  {s.time}
                </span>
                <SessionDot status={s.status} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {s.student}
                  </p>
                  <p className="text-xs text-gray-400">{s.topic}</p>
                </div>
                <SessionStatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* All students */}
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
                Invite one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students?.map((student, i) => {
                const meta = STUDENT_META[i % 4] ?? { hw: "done", paid: true };

                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 py-2.5"
                  >
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
      </div>
    </div>
  );
}
