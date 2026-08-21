import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/features/admin/students/hooks/useUser";
import { useGoals } from "@/features/shared/goals/hooks/useGoals";
import type { Goal, GoalStatusType } from "@/type/goal";
import ConfirmModal from "@/ui/ConfirmModal";
import StatCard from "@/ui/StatCard";
import TabFilters from "@/ui/TabFilters";
import GoalCard from "@/features/shared/goals/components/GoalCard";
import UpsertGoalModal from "@/features/shared/goals/components/UpsertGoalModal";
import EmptyState from "@/ui/EmptyState";
import PageLoadingState from "@/ui/PageLoadingState";

export type GoalFilterTab = "all" | GoalStatusType;

export const GOAL_TABS: GoalFilterTab[] = [
  "all",
  "in_progress",
  "achieved",
  "not_started",
];

export default function GoalsPage() {
  const { id: studentIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const userId = isAdmin ? (studentIdParam ?? "") : (authUser?.id ?? "");
  const { user: student } = useUser(isAdmin ? userId : "");
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

  function goToGoal(goalId: string) {
    navigate(
      isAdmin
        ? `/admin/students/${userId}/goals/${goalId}`
        : `/student/goals/${goalId}`,
    );
  }

  if (isAdmin && !userId) return <p>User ID is missing.</p>;
  if (isLoading) return <PageLoadingState />;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        {isAdmin ? (
          <button
            onClick={() => navigate(`/users/${userId}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft size={16} />
            <span className="hidden sm:inline">
              Back to {student?.first_name} {student?.last_name}
            </span>
            <span className="sm:hidden">Back</span>
          </button>
        ) : (
          <h1 className="page-title">My Goals</h1>
        )}

        {isAdmin && (
          <button
            onClick={() => setModalOpen("create")}
            className="btn-primary flex items-center gap-1.5"
          >
            + Add goal
          </button>
        )}
      </section>

      {/* stats */}
      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total goals"
          value={goals?.length ?? 0}
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
          label="Not Started"
          value={count("not_started")}
        />
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
        <EmptyState message="No goals matches your filter." />
      ) : (
        <div className="space-y-6">
          {filtered?.map((goal) => (
            <div
              key={goal.id}
              onClick={() => goToGoal(goal.id)}
              className="cursor-pointer"
            >
              <GoalCard
                goal={goal}
                openEdit={isAdmin ? openEdit : undefined}
                openDelete={isAdmin ? openDelete : undefined}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals (admin only) */}
      {isAdmin && modalOpen && (
        <UpsertGoalModal
          openType={modalOpen === "create" ? "Create" : "Edit"}
          onClose={closeModal}
          goal={modalOpen === "edit" ? (selectedGoal ?? undefined) : undefined}
          userId={userId}
        />
      )}

      {isAdmin && deleteId && (
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
