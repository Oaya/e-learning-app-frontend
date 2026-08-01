import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useAuth } from "../../../../contexts/AuthContext";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import { greeting } from "../../../../utils/helper";

import StatCard from "../../../../ui/StatCard";
import UpcomingLessonsPanel from "../components/UpcomingLessonsPanel";
import HomeworkPanel from "../components/HomeworkPanel";
import GoalPanel from "../components/GoalPanel";
import { useAllLessons } from "../../../admin/lessons/hooks/useAllLessons";

// ── mock goals (replace with API when goals are built) ────────────────────────
const MOCK_GOALS = [
  { id: "1", label: "Pass JLPT N3", progress: 70 },
  { id: "2", label: "Hold a 5-minute conversation", progress: 55 },
  { id: "3", label: "Master Keigo (formal speech)", progress: 40 },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { lessons } = useAllLessons();
  const { homeworks } = useHomeworks();

  const today = dayjs();

  // Upcoming lessons — scheduled and in the future
  const upcoming = (lessons ?? [])
    .filter(
      (s) => s.status === "scheduled" && dayjs(s.scheduled_at).isAfter(today),
    )
    .sort((a, b) => dayjs(a.scheduled_at).diff(dayjs(b.scheduled_at)))
    .slice(0, 5);

  // Next lesson label
  const nextLesson = upcoming[0];
  const nextLabel = nextLesson
    ? `Your next lesson is ${dayjs(nextLesson.scheduled_at).fromNow()}`
    : "No upcoming lessons";

  // Homework stats
  const totalHW = homeworks?.length ?? 0;
  const pendingHW = homeworks?.filter((h) => h.status === "pending").length;
  const completedHW = homeworks?.filter(
    (h) =>
      h.submission?.status === "submitted" ||
      h.submission?.status === "reviewed",
  ).length;

  // Completed lessons
  const completedLessons = (lessons ?? []).filter(
    (s) => s.status === "completed",
  ).length;

  // Overall goal progress
  const avgGoal = Math.round(
    MOCK_GOALS.reduce((sum, g) => sum + g.progress, 0) / MOCK_GOALS.length,
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Top bar */}
      <section className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting()},{"  "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">{nextLabel}</p>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 px-10 pt-4 lg:grid-cols-3">
        <StatCard
          label="Lessons completed"
          iconColor="text-theme-green-20"
          value={completedLessons}
          sub="Keep it up!"
          subColor
        />
        <StatCard
          label="Homework done"
          value={`${completedHW} / ${totalHW}`}
          sub={`${pendingHW} pending`}
        />
        <StatCard label="Goal progress" value={`${avgGoal}%`} sub="Overall" />
      </section>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-10 px-10 lg:grid-cols-2">
        {/* Upcoming lessons */}

        <UpcomingLessonsPanel lessons={upcoming} />

        {/* Homework */}
        <HomeworkPanel hws={homeworks} />
      </div>

      {/* Goals panel */}

      <div className="px-10">
        <GoalPanel goals={MOCK_GOALS} />
      </div>
    </div>
  );
}
