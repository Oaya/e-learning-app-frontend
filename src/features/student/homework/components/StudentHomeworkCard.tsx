import { useNavigate } from "react-router-dom";
import type { Homework } from "../../../../type/homework";
import {
  HW_BORDER_COLOR,
  HW_STATUS_BADGE,
  SCORE_BUDGE,
} from "../../../../utils/constants";
import type { ScoreType } from "../../../../type/homework_submission";
import {
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineSparkles,
} from "react-icons/hi";
import { HiOutlineLanguage } from "react-icons/hi2";
import { capitalize, getHomeworkDateLabel } from "../../../../utils/helper";

type Props = {
  hw: Homework;
};

export default function StudentHomeworkCard({ hw }: Props) {
  const navigate = useNavigate();

  const status = hw.submission ? hw.submission.status : "pending";
  const displayStatus = status === "draft" ? "pending" : status;

  const dateLabel = getHomeworkDateLabel(hw);
  const badge = SCORE_BUDGE[hw.submission?.feedback?.score as ScoreType];

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${HW_BORDER_COLOR[displayStatus]}`}
    >
      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800">{hw.title}</p>
          {hw.ai_generated && (
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
              <HiOutlineSparkles size={12} /> AI generated
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineCalendar size={14} />
            {dateLabel}
          </span>
          {hw.language && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <HiOutlineLanguage size={14} />
              {hw.language} · {capitalize(hw.level!)}
            </span>
          )}
        </div>

        {/* Feedback for reviewed homework */}
        {displayStatus === "reviewed" && (
          <div className="mt-3 rounded-lg bg-blue-50 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
              Teacher feedback
            </p>
            <p className="text-xs leading-relaxed text-blue-800">
              {hw.submission?.feedback.feedback_text}
            </p>
            {hw.submission?.feedback.score && (
              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${badge.css}`}
              >
                <badge.icon size={14} />
                {capitalize(hw.submission?.feedback.score)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[displayStatus]}`}
        >
          {status}
        </span>

        {(displayStatus === "pending" || displayStatus === "overdue") && (
          <button
            onClick={() => navigate(`/student/homework/${hw.id}/submit`)}
            className="btn-primary-pink rounded-lg px-3 py-1.5"
          >
            Submit
          </button>
        )}

        {(displayStatus === "submitted" || displayStatus === "reviewed") && (
          <button
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            onClick={() => navigate(`/student/homework/${hw.id}/view`)}
          >
            <HiOutlineEye size={14} />
            View
          </button>
        )}
      </div>
    </div>
  );
}
