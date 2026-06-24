import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import NewSessionModal from "../components/NewSessionModal";

import { useAuth } from "../../../../contexts/AuthContext";
import { useUsers } from "../../students/hooks/useUsers";
import { useSessions } from "../hooks/useSessions";
import StatCard from "../../dashboard/components/StatCard";
import SessionList from "../components/SessionList";
import type { SessionStatus } from "../../../../type/session";

type FilterTab = "all" | SessionStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  // { key: "unpaid", label: "Unpaid" },
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { users: students } = useUsers({});
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
          icon={<HiOutlineCalendar className="text-theme-green-20 h-4 w-4" />}
          label="This month"
          value={thisMonth?.length ?? 0}
          sub="sessions"
        />
        <StatCard
          icon={<HiOutlineClock className="text-theme-green-20 h-4 w-4" />}
          label="Hours taught"
          value={`${hoursThisMonth.toFixed(1)}h`}
          sub="this month"
        />
        <StatCard
          icon={
            <HiOutlineCalendarDays className="text-theme-green-20 h-4 w-4" />
          }
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
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? "border-theme-yellow-20 bg-theme-yellow-20 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search student or topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:border-theme-green-20 ml-auto w-80 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
        />
      </div>

      {/* Session list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No sessions match your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming && upcoming.length > 0 && (
            <SessionList type="upcoming" sessions={upcoming} />
          )}

          {past && past.length > 0 && (
            <SessionList type="upcoming" sessions={past} />
          )}
        </div>
      )}

      <NewSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        students={students}
        sessions={sessions}
        timezone={user?.timezone}
      />
    </div>
  );
}
