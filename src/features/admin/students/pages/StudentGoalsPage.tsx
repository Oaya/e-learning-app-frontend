import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

import { useUser } from "../hooks/useUser";
import { useGoals } from "../hooks/useGoals";
import type { Goal, GoalStatusType } from "../../../../type/goal";
import ConfirmModal from "../../../../ui/ConfirmModal";
import UpsertGoalModal from "../components/UpsertGoalModal";
import StatCard from "../../../../ui/StatCard";
import TabFilters from "../../homework/components/TabFilters";
import GoalCard from "../components/GoalCard";

export type GoalFilterTab = "all" | GoalStatusType;

export const GOAL_TABS: GoalFilterTab[] = [
  "all",
  "in_progress",
  "achieved",
  "not_started",
];

export default function StudentGoalsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ?? "";
  const { user } = useUser(userId);
  const { goals, isLoading, deleteGoal, isDeleting } = useGoals(userId);

  const [activeTab, setActiveTab] = useState<GoalFilterTab>("all");
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered =
    activeTab === "all" ? goals : goals?.filter((g) => g.status === activeTab);

  const count = (s: GoalStatusType) =>
    goals?.filter((g) => g.status === s).length ?? 0;

  function openEdit(goal: Goal) {
    setSelectedGoal(goal);
    setModalOpen("edit");
  }

  function openDelete(goal: Goal) {
    setDeleteId(goal.id);
  }

  function closeModal() {
    setModalOpen(null);
    setSelectedGoal(null);
  }

  if (!userId) return <p>User ID is missing.</p>;
  if (isLoading) return <p className="p-10 text-sm text-gray-400">Loading…</p>;

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/users/${userId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to {user?.first_name} {user?.last_name}
        </button>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setModalOpen("create")}
            className="btn-primary flex items-center gap-1.5"
          >
            + Add goal
          </button>
        </div>
      </section>

      {/* stats */}
      <section className="grid h-32 grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total goals" value={goals?.length ?? 0} />
        <StatCard label="In Progress" value={count("in_progress")} />
        <StatCard label="Achieved" value={count("achieved")} />
        <StatCard label="Not Started" value={count("not_started")} />
      </section>

      {/* Filters */}
      <div className="flex">
        <TabFilters
          tabs={GOAL_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as GoalFilterTab)}
        />
      </div>

      {/* Goal list */}
      {filtered?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
          No goals matches your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered?.map((goal) => (
            <GoalCard
              goal={goal}
              key={goal.id}
              openEdit={openEdit}
              openDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <UpsertGoalModal
          openType={modalOpen === "create" ? "Create" : "Edit"}
          onClose={closeModal}
          goal={modalOpen === "edit" ? (selectedGoal ?? undefined) : undefined}
          userId={userId}
        />
      )}

      {deleteId && (
        <ConfirmModal
          isOpen={deleteId !== null}
          title="Delete goal"
          message="Are you sure you want to delete this goal? This cannot be undone."
          isSubmitting={isDeleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            if (deleteId) {
              await deleteGoal(deleteId);
              setDeleteId(null);
            }
          }}
        />
      )}
    </div>
  );
}
