import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { HW_STATUS_BADGE } from "../../../../utils/constants";
import type { Homework } from "../../../../type/homework";
import { getHomeworkDateLabel } from "../../../../utils/helper";

type HWPanelProps = {
  hws?: Homework[];
};

export default function HomeworkPanel({ hws }: HWPanelProps) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Homework
        </p>
        <Link
          to="/student/homework"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {hws?.length === 0 ? (
        <p className="text-sm text-gray-400">No homework yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {hws?.slice(0, 4).map((hw) => {
            const dateLabel = getHomeworkDateLabel(hw);
            const status = hw.submission ? hw.submission.status : "pending";
            return (
              <div key={hw.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{hw.title}</p>
                  <p className="text-xs text-gray-400">{dateLabel}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[status]}`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
