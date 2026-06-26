import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useAuth } from "../../../../contexts/AuthContext";
import { useSessions } from "../../../admin/sessions/hooks/useSessions";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import { greeting } from "../../../../utils/helper";

import StatCard from "../../../admin/dashboard/components/StatCard";
import UpcomingSessionPanel from "../components/UpcomingSessionPanel";
import HomeworkPanel from "../components/HomeworkPanel";
import GoalPanel from "../components/GoalPanel";
import { useStudentSession } from "../hooks/useStudentSessions";

// ── mock goals (replace with API when goals are built) ────────────────────────
const MOCK_GOALS = [
  { id: "1", label: "Pass JLPT N3", progress: 70 },
  { id: "2", label: "Hold a 5-minute conversation", progress: 55 },
  { id: "3", label: "Master Keigo (formal speech)", progress: 40 },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { sessions } = useStudentSession();
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
            {greeting()},{"  "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">{nextLabel}</p>
        </div>
      </div>

      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Sessions completed"
            iconColor="text-theme-green-20"
            value={completedSessions}
            sub="Keep it up!"
            subColor
          />
          <StatCard
            label="Homework done"
            value={`${completedHW} / ${totalHW}`}
            sub={`${pendingHW} pending`}
          />
          <StatCard label="Goal progress" value={`${avgGoal}%`} sub="Overall" />
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Upcoming sessions */}

          <UpcomingSessionPanel sessions={upcoming} />

          {/* Homework */}
          <HomeworkPanel hws={homeworks} />
        </div>

        {/* Goals panel */}
        <GoalPanel goals={MOCK_GOALS} />
      </div>
    </div>
  );
}
