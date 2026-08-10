import { useActionData, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useGoal } from "../hooks/useGoal";

import GoalActivityLogsPanel from "../../../shared/goals/components/GoalActivityLogsPanel";
import GoalHeader from "@/features/shared/goals/components/goalsHeader";
import { useAuth } from "@/contexts/AuthContext";
import GoalCommentPanel from "@/features/shared/goals/components/GoalCommentPanel";

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goalId = id ?? "";
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const { goal, isLoading } = useGoal(goalId);

  const progressWidth =
    goal?.status === "achieved"
      ? 100
      : goal?.status === "not_started"
        ? 0
        : (goal?.progress ?? 0);

  if (isLoading)
    return <p className="p-10 text-sm text-gray-400">Loading...</p>;
  if (!goal)
    return <p className="p-10 text-sm text-gray-400">Goal not found.</p>;

  return (
    <div className="space-y-6 p-10">
      {/* Back */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/student/goals")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to goals
        </button>
      </section>

      {/* Goal header */}
      <GoalHeader goal={goal} progressWidth={progressWidth} />

      {/* Activity log + Teacher comment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity log */}
        <GoalActivityLogsPanel goal={goal} isAdmin={isAdmin} />

        {/* Teacher comment */}
        <GoalCommentPanel goal={goal} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
