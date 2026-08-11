import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TbSquareRoundedCheckFilled } from "react-icons/tb";

import type { Plan } from "@/type/plan";

function PlanFeatureRow({ label, value }: { label: string; value: boolean }) {
  return (
    <p className="mb-2 flex items-center gap-2">
      {value ? (
        <TbSquareRoundedCheckFilled
          size={26}
          className="text-theme-purple-20"
        />
      ) : (
        <MdOutlineClose size={26} className="text-theme-purple-20" />
      )}
      <span>{label}</span>
    </p>
  );
}

function PlanCard({ plan, bgColor }: { plan: Plan; bgColor?: string }) {
  const navigate = useNavigate();
  const studentNum = plan.features.max_students;

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
        <p className="mb-2 flex items-center gap-2">
          <TbSquareRoundedCheckFilled
            size={26}
            className="text-theme-purple-20"
          />
          <span>
            {typeof studentNum === "number"
              ? `Up to ${studentNum} students`
              : studentNum}
          </span>
        </p>
        <PlanFeatureRow
          label="Lesson scheduling"
          value={plan.features.lesson_schedule}
        />
        <PlanFeatureRow
          label="Homework assignments"
          value={plan.features.homework_assignments}
        />

        <PlanFeatureRow
          label="Lesson recordings"
          value={plan.features.lesson_recording}
        />
        <PlanFeatureRow
          label="Student goals"
          value={plan.features.student_goals}
        />
        <PlanFeatureRow
          label="Payment tracking"
          value={plan.features.payment_tracking}
        />
        <PlanFeatureRow
          label="AI homework generation"
          value={plan.features.ai_homework_generation}
        />
      </div>
    </div>
  );
}

export default PlanCard;
