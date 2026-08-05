import { useState } from "react";
import {
  GOAL_BORDER_COLOR,
  GOAL_STATUS_BADGE,
} from "../../../../utils/constants";
import type { Goal } from "../../../../type/goal";

import Badge from "../../../../ui/Badge";
import ActionBtn from "../../lessons/components/ActionButton";
import {
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlinePencil,
} from "react-icons/hi2";
import ConfirmModal from "../../../../ui/ConfirmModal";
import { useGoals } from "../hooks/useGoals";

type Props = {
  goal: Goal;
  openEdit: (goal: Goal) => void;
  userId: string;
};

export default function GoalCard({ goal, openEdit, userId }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { deleteGoal, isDeleting } = useGoals(userId);

  return (
    <div className={`card ${GOAL_BORDER_COLOR[goal.status]}`}>
      {/* Main */}
      <div className="h-14 min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800">{goal.title}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Progress bar */}
          <div className="mt-2 w-full">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-600">
                {goal.status === "not_started"
                  ? "Not started yet"
                  : goal.status === "achieved"
                    ? "100% complete"
                    : `${goal.progress ?? 0}% complete`}
              </span>
              {goal.target_date && (
                <span className="flex items-center gap-1 text-[12px] text-gray-400">
                  <HiOutlineCalendar size={14} />
                  Target: {goal.target_date}
                </span>
              )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100 text-lg">
              <div
                className={`h-full rounded-full transition-all ${GOAL_STATUS_BADGE[goal.status]} `}
                style={{
                  width: `${goal.status === "achieved" ? 100 : goal.status === "not_started" ? 0 : (goal.progress ?? 0)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badge + actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge status={goal.status} constant={GOAL_STATUS_BADGE} />

        <div className="flex gap-1">
          {/* View — goes to review page for submitted/reviewed, otherwise just icon */}

          <ActionBtn title="Edit" onClick={() => openEdit(goal)}>
            <HiOutlinePencil size={14} />
          </ActionBtn>

          <ActionBtn title="Delete" onClick={() => setDeleteId(goal.id)}>
            <HiOutlineTrash size={14} />
          </ActionBtn>
        </div>
      </div>

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
    </div>
  );
}
