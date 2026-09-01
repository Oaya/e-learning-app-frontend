import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactPaginate from "react-paginate";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";

import TabFilters from "@/ui/TabFilters";
import CardHeader from "@/ui/CardHeader";
import EmptyState from "@/ui/EmptyState";
import StudentLessonCard from "@/features/student/lessons/components/StudentLessonCard";
import StatCard from "@/ui/StatCard";
import { useUpcomingPastSplit } from "@/features/shared/lessons/hooks/useUpcomingPastSplit";
import {
  LESSON_TABS,
  type LessonFilterTab,
} from "@/features/shared/lessons/constants";
import { useLessons } from "@/features/admin/lessons/hooks/useLessons";
import { PAGE_SIZE } from "@/utils/constants";

dayjs.extend(relativeTime);

export default function StudentLessonsPage() {
  const [activeTab, setActiveTab] = useState<LessonFilterTab>("all");
  const [pastPage, setPastPage] = useState(1);
  const { lessons, isLoading } = useLessons();

  const filtered = useMemo(() => {
    return lessons?.filter((s) => {
      return activeTab === "all" ? true : s.status === activeTab;
    });
  }, [lessons, activeTab]);

  const { upcoming, past } = useUpcomingPastSplit(filtered);

  useEffect(() => {
    setPastPage(1);
  }, [activeTab]);

  const paginatedPast = past?.slice(
    (pastPage - 1) * PAGE_SIZE,
    pastPage * PAGE_SIZE,
  );

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
    <div className="page-container">
      {/* Top bar */}
      <div className="page-header-row">
        <h1 className="page-title">Lessons</h1>
      </div>

      {/* Stat */}
      <section className="grid grid-cols-3 gap-4 md:gap-6">
        <StatCard
          label="Total lessons"
          icon={HiOutlineCalendar}
          value={lessons?.length ?? 0}
        />
        <StatCard
          icon={LuCalendarDays}
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
      </section>

      {/* Filter tabs */}
      <TabFilters
        tabs={LESSON_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as LessonFilterTab)}
      />

      {isLoading && <p className="text-sm text-gray-400">Loading Lessons…</p>}

      {/* Lesson list */}
      {filtered?.length === 0 ? (
        <EmptyState message="No lessons match your filter." />
      ) : (
        <div className="space-y-4 md:space-y-6">
          {upcoming && upcoming.length > 0 && (
            <>
              <CardHeader type="upcoming" />
              <div className="space-y-2">
                {upcoming.map((l) => (
                  <StudentLessonCard key={l.id} lesson={l} />
                ))}
              </div>
            </>
          )}

          {past && past.length > 0 && (
            <>
              <CardHeader type="past" />
              <div className="space-y-4">
                {paginatedPast?.map((l) => (
                  <StudentLessonCard key={l.id} lesson={l} />
                ))}
              </div>

              {past.length > PAGE_SIZE && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  previousLabel="<"
                  forcePage={pastPage - 1}
                  onPageChange={(e) => setPastPage(e.selected + 1)}
                  pageRangeDisplayed={5}
                  pageCount={Math.ceil(past.length / PAGE_SIZE)}
                  renderOnZeroPageCount={null}
                  containerClassName="mt-4 flex items-center justify-center gap-2"
                  pageClassName="pagination"
                  activeClassName="bg-gray-200 font-semibold"
                  previousClassName="pagination"
                  nextClassName="pagination"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
