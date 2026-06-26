import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { HW_BORDER_COLOR, HW_STATUS_BADGE } from "../../../../utils/constants";
import type { Homework } from "../../../../type/homework";

type HWPanelProps = {
  hws?: Homework[];
};

export default function HomeworkPanel({ hws }: HWPanelProps) {
  // Homework to show on dashboard (overdue first, then pending, then latest reviewed)
  const dashHW = [
    ...(hws ?? []).filter((h) => h.status === "overdue"),
    ...(hws ?? []).filter((h) => h.status === "pending"),
    ...(hws ?? []).filter(
      (h) => h.status === "submitted" || h.status === "reviewed",
    ),
  ].slice(0, 4);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
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

      {dashHW.length === 0 ? (
        <p className="text-sm text-gray-400">No homework yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {dashHW.map((hw) => {
            const dateLabel =
              hw.status === "reviewed" && hw.reviewed_at
                ? `Reviewed ${hw.reviewed_at}`
                : hw.status === "submitted" && hw.submitted_at
                  ? `Submitted ${hw.submitted_at}`
                  : `Due ${hw.due_date}`;
            return (
              <div key={hw.id} className="flex items-center gap-3 py-3">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${HW_BORDER_COLOR[hw.status]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{hw.title}</p>
                  <p className="text-xs text-gray-400">{dateLabel}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[hw.status]}`}
                >
                  {hw.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
