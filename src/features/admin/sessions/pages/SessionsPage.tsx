import { useMemo, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCreditCard,
} from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import SessionCard from "../components/SessionCard";
import NewSessionButton from "../components/NewSessionButton";
import NewSessionModal, {
  type NewSessionData,
} from "../components/NewSessionModal";
import type { Session, SessionStatus } from "../types/session";

// ── Mock data (replace with API calls when backend is ready) ─────────────────
const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    student_id: "s1",
    student_name: "Sara K.",
    student_initials: "SK",
    student_color: "green",
    scheduled_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    duration_in_minutes: 60,
    status: "scheduled",
    topic: "Conversation practice",
    payment_status: "unpaid",
    has_recording: false,
  },
  {
    id: "2",
    student_id: "s2",
    student_name: "Marco R.",
    student_initials: "MR",
    student_color: "blue",
    scheduled_at: new Date(Date.now() + 86400000 * 5).toISOString(),
    duration_in_minutes: 45,
    status: "scheduled",
    topic: "Grammar — conditional sentences",
    payment_status: "unpaid",
    has_recording: false,
  },
  {
    id: "3",
    student_id: "s1",
    student_name: "Sara K.",
    student_initials: "SK",
    student_color: "green",
    scheduled_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    duration_in_minutes: 50,
    status: "completed",
    topic: "Past tense revision",
    payment_status: "paid",
    has_recording: true,
  },
  {
    id: "4",
    student_id: "s3",
    student_name: "Yuki T.",
    student_initials: "YT",
    student_color: "amber",
    scheduled_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration_in_minutes: 60,
    status: "completed",
    topic: "Vocabulary — food and cooking",
    payment_status: "unpaid",
    has_recording: false,
  },
  {
    id: "5",
    student_id: "s4",
    student_name: "Lena M.",
    student_initials: "LM",
    student_color: "pink",
    scheduled_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    duration_in_minutes: 45,
    status: "cancelled",
    topic: "Reading comprehension",
    payment_status: "unpaid",
    has_recording: false,
  },
  {
    id: "6",
    student_id: "s2",
    student_name: "Marco R.",
    student_initials: "MR",
    student_color: "blue",
    scheduled_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    duration_in_minutes: 60,
    status: "completed",
    topic: "Listening — podcast summary",
    payment_status: "paid",
    has_recording: true,
  },
];

type FilterTab = "all" | SessionStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  // { key: "unpaid",    label: "Unpaid" },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchTab = activeTab === "all" ? true : s.status === activeTab;

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.student_name.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [sessions, activeTab, search]);

  const upcoming = filtered.filter((s) => s.status === "scheduled");
  const past = filtered.filter((s) => s.status !== "scheduled");

  // Stats
  const thisMonth = sessions.filter((s) => {
    const d = new Date(s.scheduled_at);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const hoursThisMonth =
    thisMonth.reduce((acc, s) => acc + s.duration_in_minutes, 0) / 60;
  const upcomingCount = sessions.filter((s) => s.status === "scheduled").length;
  const unpaidCount = sessions.filter(
    (s) => s.payment_status === "unpaid" && s.status === "completed",
  ).length;

  function handleNewSession(data: NewSessionData) {
    const newSession: Session = {
      id: String(Date.now()),
      student_id: data.student_id,
      student_name: "Student",
      student_initials: "ST",
      student_color: "green",
      scheduled_at: data.scheduled_at,
      duration_in_minutes: data.duration_in_minutes,
      status: "scheduled",
      topic: data.topic,
      notes: data.notes,
      payment_status: "unpaid",
      has_recording: false,
    };
    setSessions((prev) => [newSession, ...prev]);
  }

  function handleCancel(session: Session) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, status: "cancelled" as const } : s,
      ),
    );
  }

  function handleDelete(session: Session) {
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
  }

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
        <NewSessionButton onClick={() => setModalOpen(true)} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<HiOutlineCalendar className="h-4 w-4 text-emerald-600" />}
          label="This month"
          value={thisMonth.length}
          sub="sessions"
        />
        <StatCard
          icon={<HiOutlineClock className="h-4 w-4 text-emerald-600" />}
          label="Hours taught"
          value={`${hoursThisMonth.toFixed(1)}h`}
          sub="this month"
        />
        <StatCard
          icon={<HiOutlineCalendarDays className="h-4 w-4 text-emerald-600" />}
          label="Upcoming"
          value={upcomingCount}
          sub="next 7 days"
        />
        <StatCard
          icon={<HiOutlineCreditCard className="h-4 w-4 text-emerald-600" />}
          label="Unpaid"
          value={unpaidCount}
          sub="sessions owed"
          subWarn={unpaidCount > 0}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? "border-emerald-500 bg-emerald-600 text-white"
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
          className="ml-auto rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      {/* Session list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No sessions match your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <section>
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Upcoming
              </p>
              <div className="space-y-2">
                {upcoming.map((s) => (
                  <SessionCard key={s.id} session={s} onCancel={handleCancel} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Past
              </p>
              <div className="space-y-2">
                {past.map((s) => (
                  <SessionCard key={s.id} session={s} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <NewSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewSession}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  subWarn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  subWarn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        {icon} {label}
      </div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      {sub && (
        <p
          className={`mt-0.5 text-xs ${subWarn ? "text-amber-600" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
