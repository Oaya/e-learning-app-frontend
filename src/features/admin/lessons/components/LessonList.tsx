import dayjs from "dayjs";
import { useMemo, useState, type ReactNode } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/ui/StatCard";
import CardHeader from "@/ui/CardHeader";
import EmptyState from "@/ui/EmptyState";
import UpsertLessonModal from "./UpsertLessonModal";
import TabFilters from "@/ui/TabFilters";
import LessonCard from "./LessonCard";
import { useAllLessons } from "@/features/shared/lessons/hooks/useAllLessons";
import { useUpcomingPastSplit } from "@/features/shared/lessons/hooks/useUpcomingPastSplit";
import {
  LESSON_TABS,
  type LessonFilterTab,
} from "@/features/shared/lessons/constants";
import type { User } from "@/type/user";

type LessonsListProps = {
  studentId?: string;
  student?: User;
  topBar?: (openModal: () => void) => ReactNode;
};

export default function LessonsList({
  studentId,
  student,
  topBar,
}: LessonsListProps) {
  const [activeTab, setActiveTab] = useState<LessonFilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { lessons } = useAllLessons(studentId);

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

  const { upcoming, past } = useUpcomingPastSplit(filtered);

  // Stats
  const thisMonth = lessons?.filter(
    (s) =>
      (s.status === "completed" || s.status === "scheduled") &&
      dayjs(s.scheduled_at).isSame(dayjs(), "month"),
  );

  const upcomingCountForThisWeek = lessons?.filter((s) => {
    const scheduledAt = dayjs(s.scheduled_at);
    const now = dayjs();
    return (
      s.status === "scheduled" &&
      scheduledAt.isAfter(now) &&
      scheduledAt.isBefore(now.add(7, "day"))
    );
  }).length;

  let hoursThisMonth: number = 0;
  if (thisMonth) {
    for (const s of thisMonth) {
      hoursThisMonth += s.duration_in_minutes / 60;
    }
  }

  return (
    <div className="page-container">
      {/* Top bar */}
      <div className="page-header-row">
        {topBar ? (
          topBar(() => setModalOpen(true))
        ) : (
          <>
            <div>
              <h1 className="page-title">Lessons</h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Manage and track all your lessons
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              + New lesson
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineCalendar}
          label="This month"
          value={thisMonth?.length ?? 0}
          sub="lessons"
        />
        <StatCard
          icon={HiOutlineClock}
          label="Hours teaching"
          value={`${hoursThisMonth.toFixed(1)}h`}
          sub="this month"
        />
        <StatCard
          icon={HiOutlineCalendarDays}
          label="Upcoming"
          value={upcomingCountForThisWeek ?? 0}
          sub="next 7 days"
        />
      </div>

      {/* Filters */}
      <div className="flex">
        <TabFilters
          tabs={LESSON_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as LessonFilterTab)}
        />

        <input
          type="text"
          placeholder="Search student or topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input ml-auto w-80 px-3 py-1.5"
        />
      </div>

      {/* Lesson list */}
      {filtered?.length === 0 ? (
        <EmptyState message="No lessons match your filter." />
      ) : (
        <div className="space-y-6">
          {upcoming && upcoming.length > 0 && (
            <section>
              <CardHeader type="upcoming" />
              <div className="space-y-2">
                {upcoming.map((s) => (
                  <LessonCard key={s.id} lesson={s} />
                ))}
              </div>
            </section>
          )}

          {past && past.length > 0 && (
            <section>
              <CardHeader type="past" />
              <div className="space-y-2">
                {past.slice(0, 8).map((s) => (
                  <LessonCard key={s.id} lesson={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <UpsertLessonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Create"
        lessons={lessons}
        timezone={user?.timezone}
        student={student}
      />
    </div>
  );
}
