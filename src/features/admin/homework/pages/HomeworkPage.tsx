import { useMemo, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  // HiOutlineSparkles,
} from "react-icons/hi2";
import HomeworkCard from "../components/HomeworkCard";
import UpsertHomeworkModal from "../components/UpsertHomeworkModal";
// import AiBanner from "../components/AiBanner";
import StatCard from "../../../../ui/StatCard";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import TabFilters from "@/ui/TabFilters";
import {
  matchesTab,
  inGroup,
  type HomeworkFilterTab,
} from "@/features/shared/homeworks/constants";

export const HOMEWORK_TABS: HomeworkFilterTab[] = [
  "all",
  "submitted",
  "overdue",
  "pending",
  "reviewed",
];

export const HOMEWORK_GROUP_ORDER: Exclude<HomeworkFilterTab, "all">[] = [
  "submitted",
  "overdue",
  "pending",
  "reviewed",
];

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { homeworks, isLoading } = useHomeworks();

  const filtered = useMemo(() => {
    return homeworks?.filter((hw) => {
      const matchedTab = matchesTab(hw, activeTab);
      const studentName = `${hw.student.first_name} ${hw.student.last_name}`;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        hw.title.toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q);
      return matchedTab && matchSearch;
    });
  }, [homeworks, activeTab, search]);

  // Stats — draft counts as pending
  const total = homeworks?.length ?? 0;
  const pending =
    homeworks?.filter((h) => h.status === "draft" || h.status === "pending")
      .length ?? 0;
  const submitted =
    homeworks?.filter((h) => h.status === "submitted").length ?? 0;
  const overdue = homeworks?.filter((h) => h.status === "overdue").length ?? 0;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Homework</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Assign, track and review student homework
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="btn-white flex items-center gap-1.5"
          >
            <HiOutlineSparkles size={16} /> Generate with AI
          </button> */}
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary-pink"
          >
            + Assign Homework
          </button>
        </div>
      </section>

      {/* AI banner */}
      {/* <AiBanner onOpen={() => setModalOpen(true)} /> */}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total assigned"
          value={total}
          sub="all time"
        />
        <StatCard
          icon={HiOutlineCheck}
          label="Submitted"
          value={submitted}
          sub="awaiting review"
          // subColor
        />
        <StatCard
          icon={HiOutlineClock}
          label="Pending"
          value={pending}
          sub="not submitted yet"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Overdue"
          value={overdue}
          sub="past due date"
        />
      </section>

      {/* Filters */}
      <div className="flex">
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
          className="form-input ml-auto w-80 px-3 py-1.5"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading homework…</p>}

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No homework matches your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {HOMEWORK_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((h) => inGroup(h, status));
            if (!group?.length) return null;
            return (
              <section key={status}>
                <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  {status === "submitted" ? "Submitted — needs review" : status}
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
