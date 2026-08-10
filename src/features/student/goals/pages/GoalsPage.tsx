import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import StatCard from "../../../../ui/StatCard";
import TabFilters from "../../../admin/homework/components/TabFilters";
import { useGoals } from "@/features/admin/students/hooks/useGoals";
import { useAuth } from "@/contexts/AuthContext";
import type { Goal, GoalStatusType } from "@/type/goal";
import { capitalize } from "@/utils/helper";
import GoalCard from "@/features/admin/students/components/GoalCard";

export type GoalsFilterTab = "all" | GoalStatusType;

export const GOAL_TABS: GoalsFilterTab[] = [
  "all",
  "in_progress",
  "achieved",
  "not_started",
];

export const GOAL_GROUP_ORDER: Exclude<GoalsFilterTab, "all">[] = [
  "in_progress",
  "achieved",
  "not_started",
];

export function inGroup(g: Goal, group: Exclude<GoalsFilterTab, "all">) {
  return g.status === group;
}

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<GoalsFilterTab>("all");
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  console.log(authUser);

  const { goals, isLoading } = useGoals(authUser?.id);

  const filtered = useMemo(() => {
    return goals?.filter((g) => {
      return activeTab === "all" ? true : g.status === activeTab;
    });
  }, [goals, activeTab]);

  //Stats - draft counts as pending
  const total = goals?.length ?? 0;
  const count = (s: GoalStatusType) =>
    goals?.filter((g) => g.status === s).length ?? 0;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">My Goals</h1>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total goals"
          value={total}
        />
        <StatCard
          icon={HiOutlineClock}
          label="In Progress"
          value={count("in_progress")}
        />
        <StatCard
          icon={HiOutlineCheck}
          label="Achieved"
          value={count("achieved")}
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Not started"
          value={count("not_started")}
        />
      </section>

      {/* Filters */}
      <TabFilters
        tabs={GOAL_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as GoalsFilterTab)}
      />

      {isLoading && <p className="text-sm text-gray-400">Loading homework…</p>}

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No homework matches your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {GOAL_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((g) => inGroup(g, status));
            if (!group?.length) return null;
            return (
              <section key={status}>
                <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  {capitalize(status)}
                </p>
                <div className="space-y-2">
                  {group?.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => navigate(`/student/goals/${goal.id}`)}
                      className="cursor-pointer"
                    >
                      <GoalCard goal={goal} />
                    </div>
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
