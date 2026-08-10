import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowRight, HiOutlinePencil } from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContext";
import UpsertGoalModal from "./UpsertGoalModal";
import ActionBtn from "../../../../ui/ActionButton";
import type { Goal } from "../../../../type/goal";

type Props = {
  goals: Goal[] | undefined;
  userId: string;
};

export default function GoalsPanel({ goals, userId }: Props) {
  const [openType, setOpenType] = useState<"Create" | "Edit" | "">("");
  const [goal, setGoal] = useState<Goal | undefined>();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = authUser?.role === "admin";

  const viewAllHref = isAdmin
    ? `/admin/students/${userId}/goals`
    : `/student/goals`;

  function handleGoalClick(g: Goal) {
    if (isAdmin) {
      navigate(`/admin/students/${userId}/goals/${g.id}`);
    } else {
      navigate(`/student/goals/${g.id}`);
    }
  }

  return (
    <>
      <div className="panel-box">
        <div className="mb-4 flex items-center justify-between">
          <p className="panel-header mb-4">Goals</p>

          <div className="flex items-center justify-between gap-4">
            <Link to={viewAllHref} className="view-all">
              View all <HiArrowRight className="h-3 w-3" />
            </Link>
            {authUser?.role === "admin" && (
              <button
                onClick={() => setOpenType("Create")}
                className="btn-white px-2 py-1"
              >
                + New
              </button>
            )}
          </div>
        </div>

        {goals?.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400 italic">
            No goals set yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {goals?.map((g) => {
              const isAchieved = g.status === "achieved";

              return (
                <div
                  key={g.id}
                  className="flex cursor-pointer items-center gap-3 py-2.5 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors"
                  onClick={() => handleGoalClick(g)}
                >
                  <div className="mt-0.5 shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{g.title}</p>

                      {authUser?.role === "admin" && (
                        <div onClick={(e) => e.stopPropagation()}>
                        <ActionBtn
                          title="Edit"
                          onClick={() => {
                            setOpenType("Edit");
                            setGoal(g);
                          }}
                        >
                          <HiOutlinePencil size={16} />
                        </ActionBtn>
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5">
                      <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            (g.progress ?? 0) >= 100
                              ? "bg-theme-green-20"
                              : "bg-theme-yellow-20"
                          }`}
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <p className="mt-0.5 text-[12px] text-gray-400">
                          {g.progress}% complete
                        </p>
                        {isAchieved && g.achieved_at ? (
                          <p className="text-theme-green-20 mt-0.5 text-[12px]">
                            Achieved at: {g.achieved_at}
                          </p>
                        ) : (
                          <p className="text-[12px] text-gray-400">
                            Target date: {g.target_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {openType && authUser?.role === "admin" && (
        <UpsertGoalModal
          openType={openType}
          onClose={() => setOpenType("")}
          userId={userId}
          goal={goal}
        />
      )}
    </>
  );
}
