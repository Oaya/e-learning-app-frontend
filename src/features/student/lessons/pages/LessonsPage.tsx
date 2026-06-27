import { useMemo, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { LessonStatus } from "../../../../type/lesson";

import TabFilters from "../../../admin/homework/components/TabFilters";

import LessonList from "../../../admin/lessons/components/LessonCardHeader";
import StudentLessonCard from "../components/StudentLessonCard";
import StatCard from "../../../admin/dashboard/components/StatCard";
import { useAllLessons } from "../../../admin/lessons/hooks/useAllLessons";

dayjs.extend(relativeTime);

type FilterTab = "all" | LessonStatus;

const TABS: FilterTab[] = ["all", "scheduled", "completed", "canceled"];

export default function StudentLessonsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { lessons, isLoading } = useAllLessons();
  const now = dayjs();

  const filtered = useMemo(() => {
    return lessons?.filter((s) => {
      const matchTab = activeTab === "all" ? true : s.status === activeTab;

      return matchTab;
    });
  }, [lessons, activeTab]);

  const upcoming = lessons?.filter(
    (s) => s.status === "scheduled" && dayjs(s.scheduled_at).isAfter(now),
  );
  const pastCompleted = lessons?.filter((s) => s.status === "completed");

  let totalHours: number = 0;

  if (pastCompleted) {
    for (const l of pastCompleted) {
      totalHours += l.duration_in_minutes / 60;
    }
  }

  const past = filtered?.filter(
    (s) => s.status !== "scheduled" || dayjs(s.scheduled_at).isBefore(now),
  );

  // Next upcoming label
  const nextLesson = upcoming?.length ? upcoming[0] : null;
  const nextLabel = nextLesson
    ? `Next in ${dayjs(nextLesson.scheduled_at).fromNow(true)}`
    : "None scheduled";

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Lessons</h1>
      </div>

      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Total lessons"
            iconColor="text-theme-green-20"
            value={lessons?.length ?? 0}
          />
          <StatCard
            label="Upcoming"
            iconColor="text-theme-green-20"
            value={upcoming?.length ?? 0}
            sub={nextLabel}
            subColor
          />
          <StatCard
            label="Total hours"
            iconColor="text-theme-green-20"
            value={`${totalHours}h`}
            sub="Completed"
          />
        </div>

        {/* Filter tabs */}
        <TabFilters
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as FilterTab)}
        />

        {isLoading && <p className="text-sm text-gray-400">Loading lessons…</p>}

        {/* Lesson list */}
        {filtered?.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            No lessons match your filter.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming */}
            {upcoming && upcoming.length > 0 && (
              <section>
                <LessonList type="upcoming" />
                <div className="space-y-2">
                  {upcoming.map((s) => (
                    <StudentLessonCard key={s.id} lesson={s} />
                  ))}
                </div>
              </section>
            )}

            {/* Past */}
            {past && past.length > 0 && (
              <section>
                <LessonList type="past" />
                <div className="space-y-2">
                  {past.map((s) => (
                    <StudentLessonCard key={s.id} lesson={s} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
