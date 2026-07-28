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
  HOMEWORK_GROUP_ORDER,
  HOMEWORK_TABS,
  inGroup,
  matchesTab,
  type HomeworkFilterTab,
} from "../../../admin/homework/pages/HomeworkPage";

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
    homeworks?.filter(
      (h) => h.submission == null || h.submission?.status === "draft",
    ).length ?? 0;
  const submitted =
    homeworks?.filter((h) => h.submission?.status === "submitted").length ?? 0;
  const overdue =
    homeworks?.filter((h) => h.submission?.status === "overdue").length ?? 0;

  return (
    <div>
      {/* Top bar */}
      <div className="bg-gray-200 px-10 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Homework</h1>
      </div>
      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={HiOutlineDocumentText}
            iconColor="text-theme-green-20"
            label="Total assigned"
            value={total}
          />
          <StatCard
            icon={HiOutlineClock}
            iconColor="text-theme-green-20"
            label="Pending"
            value={pending}
            sub="not finished yet"
          />
          <StatCard
            icon={HiOutlineCheck}
            iconColor="text-theme-green-20"
            label="Submitted"
            value={submitted}
            sub="waiting for review"
          />
          <StatCard
            icon={HiOutlineExclamationCircle}
            iconColor="text-theme-pink-20"
            label="Overdue"
            value={overdue}
            sub="past due date"
          />
        </div>

        {/* Filters */}
        <TabFilters
          tabs={HOMEWORK_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as HomeworkFilterTab)}
        />

        {isLoading && (
          <p className="text-sm text-gray-400">Loading homework…</p>
        )}

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
    </div>
  );
}
