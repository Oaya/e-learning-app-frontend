import { useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";

import UpsertGoalModal from "./UpsertGoalModal";
import { useGoals } from "../hooks/useGoals";

type Props = { userId: string };

export default function GoalsPanel({ userId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { goals } = useGoals(userId);

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="panel-header mb-4">Goals</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-white px-2 py-1"
          >
            + New
          </button>
        </div>

        {!goals || goals.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No goals set yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {goals.map((g) => {
              const isCompleted = g.status === "achieved";
              const isInProgress = g.status === "in_progress";

              return (
                <div className="flex items-start gap-3 py-2.5">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <GoCheckCircleFill className="text-theme-green-20 h-5 w-5" />
                    ) : isInProgress ? (
                      <div className="border-theme-yellow-20 bg-theme-yellow-10 h-5 w-5 rounded-full border-4" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-4 border-gray-500 bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <p>{g.title}</p>
                      <p className="text-gray-400">
                        Target date • {g.target_date}
                      </p>
                    </div>

                    {isInProgress && g.progress !== undefined && (
                      <div className="mt-1.5">
                        <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="bg-theme-green-20 h-full rounded-full transition-all"
                            style={{ width: `${g.progress}%` }}
                          />
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {g.progress}% complete
                        </p>
                      </div>
                    )}
                    {isCompleted && g.completed_at && (
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Done {g.completed_at}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UpsertGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="Create"
        userId={userId}
      />
    </>
  );
}
