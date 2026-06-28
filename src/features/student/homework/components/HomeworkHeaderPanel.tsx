import { HiOutlineCalendar, HiOutlineLanguage } from "react-icons/hi2";
import type { Homework } from "../../../../type/homework";
import { HW_STATUS_BADGE } from "../../../../utils/constants";

type Props = {
  hw: Homework;
};

export default function HomeworkHeaderPanel({ hw }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
      <h1 className="mb-2 text-base font-semibold text-gray-800">{hw.title}</h1>
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
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[hw.status] ?? ""}`}
        >
          {hw.status}
        </span>
      </div>
      {hw.instructions && (
        <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-500">
          {hw.instructions}
        </div>
      )}
    </div>
  );
}
