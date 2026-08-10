import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HiOutlineCalendar, HiOutlineCheck } from "react-icons/hi2";
import dayjs from "dayjs";

import { useGoal } from "../hooks/useGoal";
import { GOAL_STATUS_BADGE } from "../../../../utils/constants";
import Badge from "../../../../ui/Badge";

import GoalActivityLogsPanel from "../components/GoalActivityLogsPanel";

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goalId = id ?? "";

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
      <div className="panel-box">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {goal.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              {goal.created_at && (
                <span className="flex items-center gap-1">
                  <HiOutlineCalendar size={13} />
                  Started {dayjs(goal.created_at).format("YYYY-MM-DD")}
                </span>
              )}
              {goal.target_date && (
                <span className="flex items-center gap-1">
                  <HiOutlineCalendar size={13} />
                  Target {dayjs(goal.target_date).format("YYYY-MM-DD")}
                </span>
              )}
              {goal.achieved_at && (
                <span className="text-theme-green-20 flex items-center gap-1">
                  <HiOutlineCheck size={13} />
                  Achieved {dayjs(goal.achieved_at).format("YYYY-MM-DD")}
                </span>
              )}
            </div>
          </div>
          <Badge status={goal.status} constant={GOAL_STATUS_BADGE} />
        </div>

        {/* Progress bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${GOAL_STATUS_BADGE[goal.status]}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {progressWidth}%
          </span>
        </div>

        {goal.description && (
          <>
            <p className="panel-header mb-1">Goal description</p>
            <p className="text-sm leading-relaxed text-gray-500">
              {goal.description}
            </p>
          </>
        )}
      </div>

      {/* Activity log + Teacher comment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity log */}
        <GoalActivityLogsPanel goal={goal} />

        {/* Teacher comment */}
        <div className="panel-box">
          <p className="panel-header mb-3">Your teacher's comment</p>
          {goal.teacher_comment ? (
            <p className="text-sm leading-relaxed text-gray-700">
              {goal.teacher_comment}
            </p>
          ) : (
            <p className="text-center text-sm text-gray-400 italic">
              Your teacher hasn't commented yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
