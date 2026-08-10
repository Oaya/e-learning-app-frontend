import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useAuth } from "../../../../contexts/AuthContext";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import { greeting } from "../../../../utils/helper";

import StatCard from "../../../../ui/StatCard";
import UpcomingLessonsPanel from "../components/UpcomingLessonsPanel";
import HomeworkPanel from "../components/HomeworkPanel";
import { useAllLessons } from "../../../shared/lessons/hooks/useAllLessons";
import { useGoals } from "@/features/shared/goals/hooks/useGoals";
import GoalsPanel from "@/features/shared/goals/components/GoalsPanel";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { lessons } = useAllLessons();
  const { homeworks } = useHomeworks();
  const { goals } = useGoals(user?.id);

  const now = dayjs();

  console.log("e", lessons);

  // Upcoming or ongoing lessons — scheduled and not yet ended
  const upcomingOrOngoing = (lessons ?? [])
    ?.filter(
      (s) =>
        s.status === "scheduled" &&
        dayjs(s.scheduled_at).add(s.duration_in_minutes, "minute").isAfter(now),
    )
    .sort((a, b) => dayjs(a.scheduled_at).diff(dayjs(b.scheduled_at)));

  // Next lesson label
  const nextLesson = upcomingOrOngoing[0];
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

  // // Overall goal progress
  let avgGoal = 0;
  if (goals && goals?.length > 0) {
    for (const goal of goals) {
      if (goal.progress) {
        avgGoal += goal.progress;
      }
    }
    avgGoal = Math.round(avgGoal / goals.length);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Top bar */}
      <section className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="page-title">
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
        <UpcomingLessonsPanel lessons={upcomingOrOngoing} />
        {/* Homework */}
        <HomeworkPanel hws={homeworks} />
      </div>

      {/* Goals panel */}
      <div className="px-10">
        <GoalsPanel goals={goals} userId={user!.id} />
      </div>
    </div>
  );
}
