import { useState } from "react";
import type { Goal, GoalStatusType } from "@/type/goal";
import { useGoals } from "@/features/shared/goals/hooks/useGoals";
import { GOAL_STATUS_BADGE, GoalStatus } from "@/utils/constants";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";

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
    <ModalShell isOpen={!!openType} onClose={onClose} title={`${openType} Goal`}>
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title */}
          <FormField label="Goal">
            <input
              name="title"
              type="text"
              required
              defaultValue={goal?.title}
              placeholder="e.g. Hold a 5-minute conversation in Japanese"
              className="form-input"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              rows={2}
              defaultValue={goal?.description}
              className="form-textarea"
            />
          </FormField>

          {/* Status */}
          <FormField label="Status">
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
          </FormField>

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
          <FormField label="Target date">
            <input
              required
              name="target_date"
              type="date"
              defaultValue={goal?.target_date}
              className="form-input"
            />
          </FormField>

          {status === "achieved" && (
            <FormField label="Achieved date">
              <input
                required
                name="achieved_at"
                type="date"
                defaultValue={goal?.achieved_at}
                className="form-input"
              />
            </FormField>
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
    </ModalShell>
  );
}
