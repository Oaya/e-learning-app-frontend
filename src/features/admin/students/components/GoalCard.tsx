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
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  goal: Goal;
  openEdit?: (goal: Goal) => void;
  openDelete?: (goal: Goal) => void;
};

export default function GoalCard({ goal, openEdit, openDelete }: Props) {
  const { user: authUser } = useAuth();
  return (
    <div className={`card ${GOAL_BORDER_COLOR[goal.status]}`}>
      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="items-center gap-2 text-sm">
            <p className="font-semibold text-gray-800">{goal.title}</p>
          </div>
          <Badge status={goal.status} constant={GOAL_STATUS_BADGE} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Progress bar */}
          <div className="mt-2 flex flex-1 items-center gap-3">
            <div className="min-w-0 flex-1">
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

            {authUser?.role === "admin" && (
              <div
                className="flex shrink-0 gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {openEdit && (
                  <ActionBtn title="Edit" onClick={() => openEdit(goal)}>
                    <HiOutlinePencil size={14} />
                  </ActionBtn>
                )}
                {openDelete && (
                  <ActionBtn title="Delete" onClick={() => openDelete(goal)}>
                    <HiOutlineTrash size={14} />
                  </ActionBtn>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
