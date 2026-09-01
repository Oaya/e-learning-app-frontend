import dayjs from "dayjs";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactPaginate from "react-paginate";
import {
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineClock,
  HiCreditCard,
} from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/ui/StatCard";
import CardHeader from "@/ui/CardHeader";
import EmptyState from "@/ui/EmptyState";
import UpsertLessonModal from "./UpsertLessonModal";
import TabFilters from "@/ui/TabFilters";
import LessonCard from "./LessonCard";

import { useUpcomingPastSplit } from "@/features/shared/lessons/hooks/useUpcomingPastSplit";
import {
  LESSON_TABS,
  type LessonFilterTab,
} from "@/features/shared/lessons/constants";
import type { User } from "@/type/user";
import { useLessons } from "../hooks/useLessons";
import { PAGE_SIZE } from "@/utils/constants";
import PageLoadingState from "@/ui/PageLoadingState";

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
  const [pastPage, setPastPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { user: authUser } = useAuth();
  const { lessons, isLoading } = useLessons(studentId);
  const { lessons: allLessons } = useLessons();

  const canTrackInvoice =
    authUser?.role === "admin" && authUser?.has_pro_access;

  const filtered = useMemo(() => {
    return lessons?.filter((l) => {
      const matchTab = activeTab === "all" ? true : l.status === activeTab;
      const studentName = `${l.student.first_name} ${l.student.last_name}`;

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        studentName.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [lessons, activeTab, search]);

  const { upcoming, past } = useUpcomingPastSplit(filtered);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setPastPage(1);
  }, [activeTab, search]);

  const paginatedPast = past?.slice(
    (pastPage - 1) * PAGE_SIZE,
    pastPage * PAGE_SIZE,
  );

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

  const unpaidLessons =
    lessons?.filter((l) => l.invoice_id && l.invoice_status === "unpaid") ?? [];
  const unpaidStudentCount = new Set(unpaidLessons.map((l) => l.student.id))
    .size;

  if (isLoading) {
    return <PageLoadingState message="Loading lessons..." />;
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
              <p className="mt-0.5 hidden text-sm text-gray-400 sm:block">
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
      <section
        className={`grid grid-cols-2 gap-2 md:gap-4 md:pt-4 ${
          canTrackInvoice ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
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
        {canTrackInvoice && (
          <StatCard
            icon={HiCreditCard}
            label="Unpaid lessons"
            value={unpaidLessons.length}
            sub={`Across ${unpaidStudentCount} student${unpaidStudentCount === 1 ? "" : "s"}`}
          />
        )}
      </section>

      {/* Filters */}
      <div className="items-center xl:flex">
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
          className="form-input mt-2 mb-0 ml-auto h-10.5 text-xs md:text-[16px] xl:mt-0 xl:w-100"
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
              <div className="space-y-4">
                {paginatedPast?.map((s) => (
                  <LessonCard key={s.id} lesson={s} />
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
            </section>
          )}
        </div>
      )}

      <UpsertLessonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Create"
        lessons={allLessons}
        timezone={authUser?.timezone}
        student={student}
      />
    </div>
  );
}
