import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

import { useAuth } from "../../../../contexts/AuthContext";
import { useSessions } from "../hooks/useSessions";
import StatCard from "../../dashboard/components/StatCard";
import SessionList from "../components/SessionList";
import type { SessionStatus } from "../../../../type/session";
import UpsertSessionModal from "../components/UpsertSessionModal";
import TabFilters from "../../homework/components/TabFilters";

type FilterTab = "all" | SessionStatus;

const TABS: FilterTab[] = [
  "all",
  "scheduled",
  "completed",
  "canceled",
  //  "unpaid",
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { sessions } = useSessions();

  const filtered = useMemo(() => {
    return sessions?.filter((s) => {
      const matchTab = activeTab === "all" ? true : s.status === activeTab;
      const studentName = `${s.student.first_name} ${s.student.last_name}`;

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        studentName.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [sessions, activeTab, search]);

  const upcoming = filtered?.filter((s) => s.status === "scheduled");
  const past = filtered?.filter((s) => s.status !== "scheduled");

  // Stats
  const thisMonth = sessions?.filter((s) =>
    dayjs(s.scheduled_at).isSame(dayjs(), "month"),
  );

  const upcomingCountForThisWeek = sessions?.filter(
    (s) =>
      s.status === "scheduled" && dayjs(s.scheduled_at).isSame(dayjs(), "week"),
  ).length;

  let hoursThisMonth: number = 0;
  if (thisMonth) {
    for (const s of thisMonth) {
      hoursThisMonth += s.duration_in_minutes / 60;
    }
  }

  // const unpaidCount = sessions?.filter(
  //   (s) => s.payment_status === "unpaid" && s.status === "completed",
  // ).length;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Sessions</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Manage and track all your lessons
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + New session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineCalendar}
          iconColor="text-theme-green-20"
          label="This month"
          value={thisMonth?.length ?? 0}
          sub="sessions"
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
          sub="sessions owed"
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

      {/* Session list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No sessions match your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming && upcoming.length > 0 && (
            <SessionList
              type="upcoming"
              sessions={upcoming}
              allSessions={sessions}
              timezone={user?.timezone}
            />
          )}

          {past && past.length > 0 && (
            <SessionList
              type="past"
              sessions={past}
              allSessions={sessions}
              timezone={user?.timezone}
            />
          )}
        </div>
      )}

      <UpsertSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Create"
        sessions={sessions}
        timezone={user?.timezone}
      />
    </div>
  );
}
