import { useMemo, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import HomeworkCard from "../components/HomeworkCard";
import UpsertHomeworkModal from "../components/UpsertHomeworkModal";
import type { HomeworkStatus } from "../../../../type/homework";
import AiBanner from "../components/AiBanner";
import StatCard from "../../dashboard/components/StatCard";
import { useHomeworks } from "../hooks/useHomeworks";
import TabFilters from "../components/TabFilters";

export type HomeworkFilterTab = "all" | HomeworkStatus;

export const HOMEWORK_TABS: HomeworkFilterTab[] = [
  "all",
  "pending",
  "submitted",
  "overdue",
  "reviewed",
];

export const HOMEWORK_GROUP_ORDER: HomeworkStatus[] = [
  "overdue",
  "pending",
  "submitted",
  "reviewed",
];
const HOMEWORK_GROUP_LABELS: Record<HomeworkStatus, string> = {
  overdue: "Overdue",
  pending: "Awaiting submission",
  submitted: "Submitted — needs review",
  reviewed: "Reviewed",
};

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { homeworks } = useHomeworks();

  const filtered = useMemo(() => {
    return homeworks?.filter((hw) => {
      const matchTab = activeTab === "all" || hw.status === activeTab;
      const studentName = `${hw.student.first_name} ${hw.student.last_name}`;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        hw.title.toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [homeworks, activeTab, search]);

  // Stats
  const overdue = homeworks?.filter((h) => h.status === "overdue").length ?? 0;
  const submitted =
    homeworks?.filter((h) => h.status === "submitted").length ?? 0;
  const pending = homeworks?.filter((h) => h.status === "pending").length ?? 0;
  const total = homeworks?.length ?? 0;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Homework</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Assign, track and review student homework
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
          >
            <HiOutlineSparkles size={16} /> Generate with AI
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-secondary">
            + Assign homework
          </button>
        </div>
      </div>

      {/* AI banner */}
      <AiBanner onOpen={() => setModalOpen(true)} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          iconColor="text-theme-green-20"
          label="Total assigned"
          value={total}
          sub="all time"
        />
        <StatCard
          icon={HiOutlineCheck}
          iconColor="text-theme-green-20"
          label="Submitted"
          value={submitted}
          sub="awaiting review"
          // subColor
        />
        <StatCard
          icon={HiOutlineClock}
          iconColor="text-theme-green-20"
          label="Pending"
          value={pending}
          sub="not submitted yet"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          iconColor="text-theme-green-20"
          label="Overdue"
          value={overdue}
          sub="past due date"
          // subWarn={overdue > 0}
        />
      </div>

      {/* Filters */}

      <TabFilters
        tabs={HOMEWORK_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as HomeworkFilterTab)}
      />

      <input
        type="text"
        placeholder="Search student or task…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="focus:border-theme-green-20 ml-auto w-80 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
      />

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No homework matches your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {HOMEWORK_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((h) => h.status === status);
            if (group?.length === 0) return null;
            return (
              <section key={status}>
                <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  {HOMEWORK_GROUP_LABELS[status]}
                </p>
                <div className="space-y-2">
                  {group?.map((hw) => (
                    <HomeworkCard key={hw.id} hw={hw} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <UpsertHomeworkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Assign"
      />
    </div>
  );
}
