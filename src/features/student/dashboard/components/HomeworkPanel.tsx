import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { HW_STATUS_BADGE } from "@/utils/constants";
import type { Homework } from "@/type/homework";
import { getHomeworkDateLabel } from "@/utils/helper";
import Badge from "@/ui/Badge";

type HWPanelProps = {
  hws?: Homework[];
};

export default function HomeworkPanel({ hws }: HWPanelProps) {
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header">Homeworks</p>
        <Link to="/student/homework" className="view-all">
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {hws?.length === 0 ? (
        <p className="no-content text-center max-sm:m-5">No homework yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {hws?.slice(0, 8).map((hw) => {
            const dateLabel = getHomeworkDateLabel(hw);

            return (
              <div key={hw.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{hw.title}</p>
                  <p className="text-xs text-gray-400">{dateLabel}</p>
                </div>
                <Badge
                  status={hw.status}
                  constant={HW_STATUS_BADGE}
                  className="px-2.5 py-0.5 text-[11px]"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
