import { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import TabFilters from "@/ui/TabFilters";
import LessonList from "../../../shared/lessons/components/LessonCardHeader";
import EmptyLessonsState from "../../../shared/lessons/components/EmptyLessonsState";
import StudentLessonCard from "../components/StudentLessonCard";
import StatCard from "../../../../ui/StatCard";
import { useAllLessons } from "../../../shared/lessons/hooks/useAllLessons";
import { useUpcomingPastSplit } from "../../../shared/lessons/hooks/useUpcomingPastSplit";
import { LESSON_TABS, type LessonFilterTab } from "../../../shared/lessons/constants";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

dayjs.extend(relativeTime);

export default function StudentLessonsPage() {
  const [activeTab, setActiveTab] = useState<LessonFilterTab>("all");
  const { lessons } = useAllLessons();

  const filtered = useMemo(() => {
    return lessons?.filter((s) => {
      return activeTab === "all" ? true : s.status === activeTab;
    });
  }, [lessons, activeTab]);

  const { upcoming, past } = useUpcomingPastSplit(filtered);

  //Stats
  let totalHours: number = 0;
  if (past) {
    for (const l of past) {
      if (l.status === "completed") totalHours += l.duration_in_minutes / 60;
    }
  }
  // Next upcoming label
  const nextLesson = upcoming?.length ? upcoming[0] : null;
  const nextLabel = nextLesson
    ? `Next in ${dayjs(nextLesson.scheduled_at).fromNow(true)}`
    : "None scheduled";

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Lessons</h1>
        </div>
      </div>

      {/* Stat */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Total lessons"
          icon={HiOutlineCalendar}
          value={lessons?.length ?? 0}
        />
        <StatCard
          icon={HiOutlineCalendarDays}
          label="Upcoming"
          value={upcoming?.length ?? 0}
          sub={nextLabel}
          subColor
        />
        <StatCard
          icon={HiOutlineClock}
          label="Total hours"
          value={`${totalHours}h`}
          sub="Completed"
        />
      </div>

      {/* Filter tabs */}
      <TabFilters
        tabs={LESSON_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as LessonFilterTab)}
      />

      {/* Lesson list */}
      {filtered?.length === 0 ? (
        <EmptyLessonsState />
      ) : (
        <div className="space-y-6">
          {upcoming && upcoming.length > 0 && (
            <section>
              <LessonList type="upcoming" />
              <div className="space-y-2">
                {upcoming.map((l) => (
                  <StudentLessonCard key={l.id} lesson={l} />
                ))}
              </div>
            </section>
          )}

          {past && past.length > 0 && (
            <section>
              <LessonList type="past" />
              <div className="space-y-2">
                {past.slice(0, 8).map((s) => (
                  <StudentLessonCard key={s.id} lesson={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
