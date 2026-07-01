import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

type GoalPanelProps = {
  goals: {
    id: string;
    label: string;
    progress: number;
  }[];
};

export default function GoalPanel({ goals }: GoalPanelProps) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Goal progress
        </p>
        <Link
          to="/student/goals"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {goals.map((g) => (
          <div key={g.id} className="flex items-center gap-3">
            <p className="w-48 shrink-0 text-sm text-gray-700">{g.label}</p>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-emerald-500"
                style={{ width: `${g.progress}%` }}
              />
            </div>
            <p className="w-8 text-right text-xs font-medium text-emerald-600">
              {g.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
