import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

import { useAuth } from "../../../../contexts/AuthContext";
import { useLessons } from "../hooks/useLessons";
import StatCard from "../../dashboard/components/StatCard";
import LessonList from "../components/LessonList";
import type { LessonStatus } from "../../../../type/lesson";
import UpsertLessonModal from "../components/UpsertLessonModal";
import TabFilters from "../../homework/components/TabFilters";

type FilterTab = "all" | LessonStatus;

const TABS: FilterTab[] = [
  "all",
  "scheduled",
  "completed",
  "canceled",
  //  "unpaid",
];

export default function LessonsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { lessons } = useLessons();

  const filtered = useMemo(() => {
    return lessons?.filter((s) => {
      const matchTab = activeTab === "all" ? true : s.status === activeTab;
      const studentName = `${s.student.first_name} ${s.student.last_name}`;

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        studentName.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [lessons, activeTab, search]);

  const upcoming = filtered?.filter((s) => s.status === "scheduled");
  const past = filtered?.filter((s) => s.status !== "scheduled");

  // Stats
  const thisMonth = lessons?.filter((s) =>
    dayjs(s.scheduled_at).isSame(dayjs(), "month"),
  );

  const upcomingCountForThisWeek = lessons?.filter(
    (s) =>
      s.status === "scheduled" && dayjs(s.scheduled_at).isSame(dayjs(), "week"),
  ).length;

  let hoursThisMonth: number = 0;
  if (thisMonth) {
    for (const s of thisMonth) {
      hoursThisMonth += s.duration_in_minutes / 60;
    }
  }

  // const unpaidCount = lessons?.filter(
  //   (s) => s.payment_status === "unpaid" && s.status === "completed",
  // ).length;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Lessons</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Manage and track all your lessons
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + New lesson
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineCalendar}
          iconColor="text-theme-green-20"
          label="This month"
          value={thisMonth?.length ?? 0}
          sub="lessons"
        />
        <StatCard
          icon={HiOutlineClock}
          iconColor="text-theme-green-20"
          label="Hours taught"
          value={`${hoursThisMonth.toFixed(1)}h`}
          sub="this month"
        />
        <StatCard
          icon={HiOutlineCalendarDays}
          iconColor="text-theme-green-20"
          label="Upcoming"
          value={upcomingCountForThisWeek ?? 0}
          sub="next 7 days"
        />
        {/* <StatCard
          icon={<HiOutlineCreditCard className="h-4 w-4 text-theme-green-20" />}
          label="Unpaid"
          value={unpaidCount}
          sub="lessons owed"
          subWarn={unpaidCount > 0}
        /> */}
      </div>

      {/* Filters */}
      <TabFilters
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as FilterTab)}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search student or topic…"
      />

      {/* Lesson list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No lessons match your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming && upcoming.length > 0 && (
            <LessonList
              type="upcoming"
              lessons={upcoming}
              allLessons={lessons}
              timezone={user?.timezone}
            />
          )}

          {past && past.length > 0 && (
            <LessonList
              type="past"
              lessons={past}
              allLessons={lessons}
              timezone={user?.timezone}
            />
          )}
        </div>
      )}

      <UpsertLessonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Create"
        lessons={lessons}
        timezone={user?.timezone}
      />
    </div>
  );
}
