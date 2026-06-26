import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

import { useSessions } from "../../../admin/sessions/hooks/useSessions";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import { greeting } from "../../../../utils/helper";
import dayjs from "dayjs";

// ── helpers ──────────────────────────────────────────────────────────────────
function greetingEmoji() {
  const h = new Date().getHours();
  if (h < 12) return "☀️";
  if (h < 17) return "👋";
  return "🌙";
}

const HW_BORDER: Record<string, string> = {
  overdue: "bg-red-400",
  pending: "bg-amber-400",
  submitted: "bg-emerald-400",
  reviewed: "bg-blue-400",
};

const HW_BADGE: Record<string, string> = {
  overdue: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  submitted: "bg-emerald-50 text-emerald-700",
  reviewed: "bg-blue-50 text-blue-700",
};

// ── mock goals (replace with API when goals are built) ────────────────────────
const MOCK_GOALS = [
  { id: "1", label: "Pass JLPT N3", progress: 70 },
  { id: "2", label: "Hold a 5-minute conversation", progress: 55 },
  { id: "3", label: "Master Keigo (formal speech)", progress: 40 },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { homeworks } = useHomeworks({});

  const today = dayjs();

  // Upcoming sessions — scheduled and in the future
  const upcoming = (sessions ?? [])
    .filter(
      (s) => s.status === "scheduled" && dayjs(s.scheduled_at).isAfter(today),
    )
    .sort((a, b) => dayjs(a.scheduled_at).diff(dayjs(b.scheduled_at)))
    .slice(0, 3);

  // Next session label
  const nextSession = upcoming[0];
  const nextLabel = nextSession
    ? `Your next session is ${dayjs(nextSession.scheduled_at).fromNow()}`
    : "No upcoming sessions";

  // Homework stats
  const completedHW = (homeworks ?? []).filter(
    (h) => h.status === "submitted" || h.status === "reviewed",
  ).length;
  const totalHW = (homeworks ?? []).length;
  const pendingHW = (homeworks ?? []).filter(
    (h) => h.status === "pending",
  ).length;

  // Homework to show on dashboard (overdue first, then pending, then latest reviewed)
  const dashHW = [
    ...(homeworks ?? []).filter((h) => h.status === "overdue"),
    ...(homeworks ?? []).filter((h) => h.status === "pending"),
    ...(homeworks ?? []).filter((h) => h.status === "submitted" || h.status === "reviewed"),
  ].slice(0, 4);

  // Completed sessions
  const completedSessions = (sessions ?? []).filter(
    (s) => s.status === "completed",
  ).length;

  // Overall goal progress
  const avgGoal = Math.round(
    MOCK_GOALS.reduce((sum, g) => sum + g.progress, 0) / MOCK_GOALS.length,
  );

  return (
    <div className="space-y-0">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting()}, {greetingEmoji()}{" "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {today.format("dddd, MMM D")} · {nextLabel}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Sessions completed</p>
            <p className="text-2xl font-semibold text-gray-800">{completedSessions}</p>
            <p className="mt-1 text-xs text-emerald-600">Keep it up!</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Homework done</p>
            <p className="text-2xl font-semibold text-gray-800">
              {completedHW} / {totalHW}
            </p>
            <p className="mt-1 text-xs text-gray-400">{pendingHW} pending</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Goal progress</p>
            <p className="text-2xl font-semibold text-gray-800">{avgGoal}%</p>
            <p className="mt-1 text-xs text-gray-400">Overall</p>
          </div>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Upcoming sessions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Upcoming sessions
              </p>
              <Link to="/student/sessions" className="text-xs text-emerald-600 hover:underline">
                View all
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400">No upcoming sessions.</p>
            ) : (
              <div className="space-y-0 divide-y divide-gray-100">
                {upcoming.map((s) => {
                  const dt = dayjs(s.scheduled_at);
                  return (
                    <div key={s.id} className="flex items-center gap-4 py-3">
                      <div className="min-w-[40px] text-center">
                        <p className="text-lg font-semibold leading-none text-gray-800">
                          {dt.format("D")}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400">
                          {dt.format("MMM")}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {dt.format("h:mm A")} · {s.duration_in_minutes} min
                        </p>
                        <p className="text-xs text-gray-400">{s.topic}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        Scheduled
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Homework */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Homework
              </p>
              <Link to="/student/homework" className="text-xs text-emerald-600 hover:underline">
                View all
              </Link>
            </div>

            {dashHW.length === 0 ? (
              <p className="text-sm text-gray-400">No homework yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {dashHW.map((hw) => {
                  const dateLabel =
                    hw.status === "reviewed" && hw.reviewed_at
                      ? `Reviewed ${hw.reviewed_at}`
                      : hw.status === "submitted" && hw.submitted_at
                        ? `Submitted ${hw.submitted_at}`
                        : `Due ${hw.due_date}`;
                  return (
                    <div key={hw.id} className="flex items-center gap-3 py-3">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${HW_BORDER[hw.status]}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-800">{hw.title}</p>
                        <p className="text-xs text-gray-400">{dateLabel}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_BADGE[hw.status]}`}
                      >
                        {hw.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Goals panel */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Goal progress
            </p>
            <Link to="/student/goals" className="text-xs text-emerald-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {MOCK_GOALS.map((g) => (
              <div key={g.id} className="flex items-center gap-3">
                <p className="w-48 shrink-0 text-sm text-gray-700">{g.label}</p>
                <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <p className="w-8 text-right text-xs font-medium text-emerald-600">
                  {g.progress}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
