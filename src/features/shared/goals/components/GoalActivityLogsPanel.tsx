import { useState } from "react";
import dayjs from "dayjs";
import {
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";

import LogProgressModal from "@/features/student/goals/components/LogProgressModal";
import type { Goal, GoalActivity } from "@/type/goal";
import { useGoal } from "@/features/shared/goals/hooks/useGoal";
import ActionBtn from "@/ui/ActionButton";

type Props = {
  goal: Goal;
  isAdmin: boolean;
};

export default function GoalActivityLogsPanel({ goal, isAdmin }: Props) {
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [editActivity, setEditActivity] = useState<GoalActivity | null>(null);
  const { removeActivity } = useGoal(goal.id);

  function openEdit(act: GoalActivity) {
    setEditActivity(act);
    setModalOpen("edit");
  }

  const progressWidth =
    goal?.status === "achieved"
      ? 100
      : goal?.status === "not_started"
        ? 0
        : (goal?.progress ?? 0);

  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header">
          {isAdmin ? "Student activity log" : "activity log"}
        </p>
        {goal.status !== "achieved" && !isAdmin && (
          <button
            onClick={() => setModalOpen("create")}
            className="btn-white flex items-center gap-1.5 text-xs"
          >
            + Log progress
          </button>
        )}
      </div>

      {goal?.activities?.length === 0 ? (
        <p className="text-center text-sm text-gray-400 italic">
          No activities logged yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {goal.activities?.map((activity) => (
            <div
              key={activity.id}
              className="group flex items-center gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">{activity.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  {activity.date && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiOutlineCalendar size={13} />
                      {dayjs(activity.date).format("YYYY-MM-DD")}
                    </span>
                  )}
                  {!isAdmin && activity.progress !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        activity.progress === 100
                          ? "bg-theme-green-30 text-theme-green-20"
                          : "bg-theme-purple-10/20 text-theme-purple-50"
                      }`}
                    >
                      {`${activity.progress}%`}
                    </span>
                  )}
                </div>
              </div>

              {isAdmin ? (
                activity.progress !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      activity.progress === 100
                        ? "bg-theme-green-30 text-theme-green-20"
                        : "bg-theme-purple-10/20 text-theme-purple-50"
                    }`}
                  >
                    {`${activity.progress}%`}
                  </span>
                )
              ) : (
                <div className="flex gap-1">
                  <ActionBtn title="Edit" onClick={() => openEdit(activity)}>
                    <HiOutlinePencil size={16} />
                  </ActionBtn>
                  <ActionBtn
                    title="Delete"
                    onClick={() => removeActivity(activity.id)}
                  >
                    <HiOutlineTrash size={16} />
                  </ActionBtn>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <LogProgressModal
          openType={modalOpen === "create" ? "Create" : "Edit"}
          onClose={() => setModalOpen(null)}
          currentProgress={progressWidth}
          currentStatus={goal.status}
          goalId={goal.id}
          activity={
            modalOpen === "edit" ? (editActivity ?? undefined) : undefined
          }
        />
      )}
    </div>
  );
}
