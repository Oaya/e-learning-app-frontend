import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { TbSquareRoundedCheckFilled } from "react-icons/tb";
import type { Plan } from "../../../type/plan";

function PlanList({ text }: { text: string }) {
  return (
    <p className="mb-2 flex items-center gap-2">
      <TbSquareRoundedCheckFilled size={26} className="text-theme-purple-20" />
      <span>{text}</span>
    </p>
  );
}

function PlanCard({ plan, bgColor }: { plan: Plan; bgColor?: string }) {
  const navigate = useNavigate();
  const projectNum = plan.features.max_courses;
  const userNum = plan.features.max_users;

  return (
    <div
      onClick={() =>
        navigate("/signup", { state: { selectedPlan: plan.name } })
      }
      className={[
        "border-default block w-100 rounded-2xl border border-gray-200 p-6 text-left shadow-md transition hover:shadow-2xl",
        bgColor ?? "bg-white",
      ].join(" ")}
    >
      <h1 className="text-heading mb-3 text-3xl leading-8 font-semibold tracking-tight capitalize">
        {plan.name}
      </h1>
      <h2 className="text-lg font-semibold">
        {plan.price === 0 ? "Free" : `$${plan.price} / month`}
      </h2>

      <div className="text-body my-6 text-lg">
        <PlanList text="Unlimited video lessons" />
        <PlanList text="Progress tracking" />
        <PlanList text="Student management" />
        <PlanList text="Basic analytics" />
        <PlanList text={`${projectNum} course${projectNum === 1 ? "" : "s"}`} />
        <PlanList text={`${userNum} user${userNum === 1 ? "" : "s"}`} />

        <p className="mb-2 flex items-center gap-2">
          {plan.features.quizzes ? (
            <TbSquareRoundedCheckFilled
              size={26}
              className="text-theme-purple-20"
            />
          ) : (
            <MdOutlineClose size={26} className="text-theme-purple-20" />
          )}
          <span>
            {plan.features.quizzes ? "Quizzes included" : "No quizzes"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default PlanCard;
