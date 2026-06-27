import { useMemo, useState } from "react";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import type { Homework, HomeworkStatus } from "../../../../type/homework";
import SubmitHomeworkModal from "../components/SubmitHomeworkModal";
import {
  HOMEWORK_GROUP_ORDER,
  HOMEWORK_TABS,
  type HomeworkFilterTab,
} from "../../../admin/homework/pages/HomeworkPage";
import StatCard from "../../../admin/dashboard/components/StatCard";
import TabFilters from "../../../admin/homework/components/TabFilters";
import StudentHomeworkCard from "../../lessons/components/StudentHomeworkCard";

const HOMEWORK_GROUP_LABELS: Record<HomeworkStatus, string> = {
  overdue: "Overdue",
  pending: "Pending",
  submitted: "Submitted — waiting for review",
  reviewed: "Reviewed",
};

export default function StudentHomeworkPage() {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const [submitHw, setSubmitHw] = useState<Homework | null>(null);
  const { homeworks, isLoading } = useHomeworks();

  const filtered = useMemo(() => {
    return homeworks?.filter((s) => {
      return activeTab === "all" ? true : s.status === activeTab;
    });
  }, [homeworks, activeTab]);

  const stats = homeworks?.reduce(
    (acc, h) => {
      acc.total++;
      acc[h.status] = (acc[h.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, submitted: 0, reviewed: 0 } as Record<
      string,
      number
    >,
  );

  async function handleSubmit(hwId: string, text: string, file: File | null) {
    // TODO: POST /api/homeworks/:id/submit { submission_text: text, file }
    console.log("submit", { hwId, text, file });
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-gray-200 px-10 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Homework</h1>
      </div>
      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Object.entries(stats ?? {}).map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
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
              const group = filtered?.filter((h) => h.status === status);
              if (group?.length === 0) return null;
              return (
                <section key={status}>
                  <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                    {HOMEWORK_GROUP_LABELS[status]}
                  </p>
                  <div className="space-y-2">
                    {group?.map((hw) => (
                      <StudentHomeworkCard key={hw.id} hw={hw} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit modal */}
      {submitHw && (
        <SubmitHomeworkModal
          hw={submitHw}
          isOpen={true}
          onClose={() => setSubmitHw(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
