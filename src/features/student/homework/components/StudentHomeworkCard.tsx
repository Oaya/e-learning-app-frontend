import { useNavigate } from "react-router-dom";
import type { Homework } from "../../../../type/homework";
import { HW_BORDER_COLOR, HW_STATUS_BADGE } from "../../../../utils/constants";
import {
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { HiOutlineLanguage } from "react-icons/hi2";
import { getHomeworkDateLabel } from "../../../../utils/helper";
import Badge from "../../../../ui/Badge";
import dayjs from "dayjs";

type Props = {
  hw: Homework;
};

export default function StudentHomeworkCard({ hw }: Props) {
  const navigate = useNavigate();

  const dateLabel = getHomeworkDateLabel(hw);

  return (
    <div className={`card ${HW_BORDER_COLOR[hw.status]}`}>
      {/* Main */}
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-medium text-gray-800">{hw.title}</p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineCalendar size={16} />
            {dateLabel}
          </span>
          {hw.language && (
            <span className="flex items-center gap-1 text-xs text-gray-400 capitalize">
              <HiOutlineLanguage size={16} />
              {hw.language} · {hw.level}
            </span>
          )}
        </div>
      </div>

      {/* Badge + actions */}
      <div className="flex shrink-0 flex-col items-end gap-1 capitalize">
        <Badge status={hw.status} constant={HW_STATUS_BADGE} />

        <div className="flex gap-1">
          {(hw.status === "pending" ||
            hw.status === "overdue" ||
            hw.status === "draft") && (
            <button
              onClick={() => navigate(`/student/homework/${hw.id}/submit`)}
              className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
            >
              <HiOutlinePencilAlt size={16} />
              Submit
            </button>
          )}

          {(hw.status === "submitted" || hw.status === "reviewed") && (
            <button
              className="btn-white mt-2 flex items-center gap-1 px-2 py-1.5"
              onClick={() => navigate(`/student/homework/${hw.id}/view`)}
            >
              <HiOutlineEye size={16} />
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
