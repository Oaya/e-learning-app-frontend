import { useMemo, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import StatCard from "../../../../ui/StatCard";
import TabFilters from "../../../admin/homework/components/TabFilters";
import StudentHomeworkCard from "../components/StudentHomeworkCard";
import {
  inGroup,
  matchesTab,
} from "../../../admin/homework/pages/HomeworkPage";

export type HomeworkFilterTab =
  | "all"
  | "pending"
  | "submitted"
  | "overdue"
  | "reviewed";

export const STUDENT_HOMEWORK_TABS: HomeworkFilterTab[] = [
  "all",
  "overdue",
  "pending",
  "submitted",
  "reviewed",
];

export const STUDENT_HOMEWORK_GROUP_ORDER: Exclude<HomeworkFilterTab, "all">[] =
  ["overdue", "pending", "submitted", "reviewed"];

export default function StudentHomeworkPage() {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const { homeworks, isLoading } = useHomeworks();

  const filtered = useMemo(
    () => homeworks?.filter((h) => matchesTab(h, activeTab)),
    [homeworks, activeTab],
  );

  //Stats - draft counts as pending
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
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total assigned"
          value={total}
        />
        <StatCard
          icon={HiOutlineClock}
          label="Pending"
          value={pending}
          sub="not finished yet"
        />
        <StatCard
          icon={HiOutlineCheck}
          label="Submitted"
          value={submitted}
          sub="waiting for review"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Overdue"
          value={overdue}
          sub="past due date"
        />
      </section>

      {/* Filters */}
      <TabFilters
        tabs={STUDENT_HOMEWORK_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as HomeworkFilterTab)}
      />

      {isLoading && <p className="text-sm text-gray-400">Loading homework…</p>}

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No homework matches your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {STUDENT_HOMEWORK_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((h) => inGroup(h, status));
            if (!group?.length) return null;
            return (
              <section key={status}>
                <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  {status == "submitted"
                    ? "Submitted — waiting for review"
                    : status}
                </p>
                <div className="space-y-2">
                  {group.map((hw) => (
                    <StudentHomeworkCard key={hw.id} hw={hw} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
