import type { Homework } from "../../../../type/homework";
import dayjs from "dayjs";
import { capitalize } from "../../../../utils/helper";
import Badge from "../../../../ui/badge";
import { HW_STATUS_BADGE } from "../../../../utils/constants";

type Props = { homeworks: Homework[] | undefined };

export default function HomeworksPanel({ homeworks }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="panel-header mb-4">Homeworks</p>
      {homeworks?.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No homework assigned.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {homeworks?.slice(0, 4).map((hw) => {
            const status = hw.submission?.status ?? "pending";
            const displayStatus = status === "draft" ? "pending" : status;
            return (
              <div
                key={hw.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {hw.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Due {dayjs(hw.due_date).format("MMM D")}
                  </p>
                </div>
                <Badge
                  value={capitalize(displayStatus)}
                  status={displayStatus}
                  constant={HW_STATUS_BADGE}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
