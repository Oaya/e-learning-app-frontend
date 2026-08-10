import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import type { GoalActivity, GoalStatusType } from "../../../../type/goal";
import { GOAL_STATUS_BADGE } from "../../../../utils/constants";
import { useGoal } from "@/features/shared/goals/hooks/useGoal";

type Props = {
  openType: "Create" | "Edit";
  onClose: () => void;
  currentProgress: number;
  currentStatus: GoalStatusType;
  goalId: string;
  activity?: GoalActivity;
};

const QUICK_SET = [25, 50, 75, 100] as const;

export default function LogProgressModal({
  onClose,
  openType,
  currentProgress,
  currentStatus,
  goalId,
  activity,
}: Props) {
  const [description, setDescription] = useState(activity?.description ?? "");
  const [date, setDate] = useState(activity?.date ?? "");
  const [progress, setProgress] = useState(
    activity ? activity.progress : currentProgress,
  );
  const {
    addActivityLog,
    updateActivityLog,
    isAddingActivity,
    isUpdatingActivity,
  } = useGoal(goalId);

  const newStatus: GoalStatusType =
    progress === 100
      ? "achieved"
      : progress === 0
        ? "not_started"
        : "in_progress";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !date) return;

    try {
      const data = {
        description: description.trim(),
        date: date,
        progress,
        status: newStatus,
        achieved_at:
          newStatus === "achieved"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      };

      if (openType === "Edit" && activity) {
        await updateActivityLog({ activity_id: activity.id, ...data });
      } else {
        await addActivityLog(data);
      }

      setDescription("");
      setDate("");
      setProgress(currentProgress);
      onClose();
    } catch {
      //
    }
  }

  if (!openType) return null;
  const isSubmitting = isAddingActivity || isUpdatingActivity;

  return (
    <div className="modal-overlay p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="section-title">
            {openType} Log progress
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {/* Description */}
          <div>
            <label className="sm-label">What did you do?</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Watched a French film and noted past tense uses"
              className="form-input"
              autoFocus
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="sm-label">
              Date <span className="font-normal text-gray-300"></span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="form-input"
            />
          </div>

          {/* Progress */}
          <div>
            <label className="sm-label">Update progress</label>
            <div className="mt-1 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              {/* Value + status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-semibold text-gray-800">
                    {progress}%
                  </span>
                  {newStatus !== currentStatus && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${GOAL_STATUS_BADGE[newStatus]}`}
                    >
                      → {newStatus.replace("_", " ")}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  Was {currentProgress}%
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="accent-theme-yellow-20 w-full"
              />

              {/* Quick set */}
              <div>
                <p className="mb-2 text-xs text-gray-400">Quick set</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SET.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setProgress(val)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        progress === val
                          ? "border-theme-purple-50 bg-theme-purple-50/10 text-theme-purple-50"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {val === 100 ? "100% - Achieved!" : `${val}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-pink"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
