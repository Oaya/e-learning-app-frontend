import dayjs from "dayjs";
import { HiOutlineCalendar, HiOutlineLanguage } from "react-icons/hi2";
import type { Homework } from "../../../../type/homework";
import { HW_STATUS_BADGE } from "../../../../utils/constants";
import Badge from "../../../../ui/Badge";

type Props = {
  hw: Homework;
};

export default function HomeworkHeaderPanel({ hw }: Props) {
  const overDue =
    hw.status === "overdue" ||
    (!!hw.submission?.submitted_at &&
      dayjs(hw.submission.submitted_at).isAfter(hw.due_date, "day"));

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
      <div className="flex gap-4 text-base">
        <h1 className="mb-2 font-semibold text-gray-800">{hw.title}</h1>
        {overDue && (
          <p className="text-red-500">
            This Homework is Overdue. You may not get feedback.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <HiOutlineCalendar className="h-3.5 w-3.5" />
          Due {hw.due_date}
        </span>
        {hw.language && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineLanguage className="h-3.5 w-3.5" />
            {hw.language} · {hw.level}
          </span>
        )}

        {hw.submission?.submitted_at && (
          <span className="text-xs text-gray-400">
            Submitted {hw.submission.submitted_at}
          </span>
        )}

        <Badge status={hw.status} constant={HW_STATUS_BADGE} />
      </div>
      {hw.instructions && (
        <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-500">
          {hw.instructions}
        </div>
      )}
    </div>
  );
}
