import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useGoal } from "@/features/shared/goals/hooks/useGoal";
import { useGoals } from "@/features/shared/goals/hooks/useGoals";
import { useUser } from "@/features/admin/students/hooks/useUser";

import UpsertGoalModal from "@/features/shared/goals/components/UpsertGoalModal";
import ConfirmModal from "@/ui/ConfirmModal";
import GoalHeader from "@/features/shared/goals/components/goalsHeader";
import GoalCommentPanel from "@/features/shared/goals/components/GoalCommentPanel";
import GoalActivityLogsPanel from "@/features/shared/goals/components/GoalActivityLogsPanel";
import { useAuth } from "@/contexts/AuthContext";
import PageLoadingState from "@/ui/PageLoadingState";

export default function AdminGoalDetailPage() {
  const { id: studentId, goalId } = useParams<{ id: string; goalId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const sid = studentId ?? "";
  const gid = goalId ?? "";

  const { goal, isLoading } = useGoal(gid);
  const { user } = useUser(sid);
  const { deleteGoal, isDeleting } = useGoals(sid);

  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [deleteGoalOpen, setDeleteGoalOpen] = useState(false);

  const progressWidth =
    goal?.status === "achieved"
      ? 100
      : goal?.status === "not_started"
        ? 0
        : (goal?.progress ?? 0);

  if (isLoading) return <PageLoadingState />;
  if (!goal)
    return <p className="p-10 text-sm text-gray-400">Goal not found.</p>;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        <button
          onClick={() => navigate(`/admin/students/${sid}/goals`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to {user?.first_name ?? "student"}'s goals
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setEditGoalOpen(true)}
            className="btn-white flex items-center gap-1.5 px-3 py-1.5"
          >
            <HiOutlinePencil size={15} />
            Edit
          </button>
          <button
            onClick={() => setDeleteGoalOpen(true)}
            className="btn-primary-pink flex items-center gap-1.5 px-3 py-1.5"
          >
            <HiOutlineTrash size={15} />
            Delete
          </button>
        </div>
      </section>

      {/* Goal header */}
      <GoalHeader goal={goal} progressWidth={progressWidth} />

      {/* Activity log  */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GoalActivityLogsPanel goal={goal} isAdmin={isAdmin} />
        {/* Teacher comments */}
        <GoalCommentPanel goal={goal} isAdmin={isAdmin} />
      </div>

      {/* Modals */}
      {editGoalOpen && (
        <UpsertGoalModal
          openType="Edit"
          onClose={() => setEditGoalOpen(false)}
          goal={goal}
          userId={sid}
        />
      )}

      {deleteGoalOpen && (
        <ConfirmModal
          isOpen
          title="Delete goal"
          message="Are you sure you want to delete this goal? This cannot be undone."
          isSubmitting={isDeleting}
          onCancel={() => setDeleteGoalOpen(false)}
          onConfirm={async () => {
            await deleteGoal(goal.id);
            navigate(`/admin/students/${sid}/goals`);
          }}
        />
      )}
    </div>
  );
}
