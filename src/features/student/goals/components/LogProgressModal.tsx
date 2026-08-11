import { useState } from "react";
import type { GoalActivity, GoalStatusType } from "@/type/goal";
import { GOAL_STATUS_BADGE } from "@/utils/constants";
import { useGoal } from "@/features/shared/goals/hooks/useGoal";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";

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
    <ModalShell
      isOpen={!!openType}
      onClose={onClose}
      title={`${openType} Log progress`}
      maxWidth="max-w-xl"
    >
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Description */}
          <FormField label="What did you do?">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Watched a French film and noted past tense uses"
              className="form-input"
              autoFocus
              required
            />
          </FormField>

          {/* Date */}
          <FormField label="Date">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="form-input"
            />
          </FormField>

          {/* Progress */}
          <FormField label="Update progress">
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
          </FormField>

          {/* Footer */}
          <div className="modal-footer">
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
    </ModalShell>
  );
}
