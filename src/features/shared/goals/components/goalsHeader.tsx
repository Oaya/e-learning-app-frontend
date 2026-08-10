import type { Goal } from "@/type/goal";
import Badge from "@/ui/Badge";
import { GOAL_STATUS_BADGE } from "@/utils/constants";
import dayjs from "dayjs";
import {
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineClock,
} from "react-icons/hi2";

type Props = {
  goal: Goal;
  progressWidth: number;
};

export default function GoalHeader({ goal, progressWidth }: Props) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{goal.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {goal.created_at && (
              <span className="flex items-center gap-1">
                <HiOutlineCalendar size={13} />
                Started {dayjs(goal.created_at).format("YYYY-MM-DD")}
              </span>
            )}
            {goal.target_date && (
              <span className="flex items-center gap-1">
                <HiOutlineClock size={13} />
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
  );
}
