import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import type { Goal, GoalStatusType } from "../../../../type/goal";
import { useGoals } from "../hooks/useGoals";
import { GOAL_STATUS_BADGE, GoalStatus } from "../../../../utils/constants";

type Props = {
  openType: "Create" | "Edit";
  onClose: () => void;
  goal?: Goal;
  userId: string;
};

export default function UpsertGoalModal({
  openType,
  onClose,
  goal,
  userId,
}: Props) {
  const [status, setStatus] = useState<GoalStatusType>(
    goal?.status ?? "not_started",
  );
  const [progress, setProgress] = useState(goal?.progress ?? 0);
  const { createGoal, updateGoal, isCreating, isUpdating } = useGoals(userId);

  if (!openType) return null;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    try {
      let progressVal = 0;

      if (status === "in_progress") {
        progressVal = progress;
      } else if (status === "achieved") {
        progressVal = 100;
      }
      const data = {
        student_id: userId,
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        status,
        progress: progressVal,
        target_date: (fd.get("target_date") as string) || undefined,
        achieved_at:
          status === "achieved"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      };

      if (openType === "Edit" && goal) {
        await updateGoal({ id: goal.id, data });
      } else {
        await createGoal(data);
      }

      onClose();
    } catch {
      //
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            {openType} Goal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Title */}
          <div>
            <label className="sm-label">Goal</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={goal?.title}
              placeholder="e.g. Hold a 5-minute conversation in Japanese"
              className="form-input"
            />
          </div>

          <div>
            <label className="sm-label">Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={goal?.description}
              className="form-textarea"
            />
          </div>

          {/* Status */}
          <div>
            <label className="sm-label">Status</label>
            <div className="flex gap-2">
              {(Object.entries(GoalStatus) as [GoalStatusType, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                      status === key
                        ? `border-transparent ${GOAL_STATUS_BADGE[key]}`
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Progress — only when in_progress */}
          {status === "in_progress" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="sm-label" style={{ marginBottom: 0 }}>
                  Progress
                </label>
                <span className="text-sm font-medium text-gray-700">
                  {progress}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="accent-theme-yellow-20 w-full"
              />
            </div>
          )}

          {/* Target date */}
          <div>
            <label className="sm-label">Target date</label>
            <input
              required
              name="target_date"
              type="date"
              defaultValue={goal?.target_date}
              className="form-input"
            />
          </div>

          {status === "achieved" && (
            <div>
              <label className="sm-label">Achieved date</label>
              <input
                required
                name="achieved_at"
                type="date"
                defaultValue={goal?.achieved_at}
                className="form-input"
              />
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-pink"
            >
              {isSubmitting
                ? "Saving…"
                : openType === "Edit"
                  ? "Save changes"
                  : "Add goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
