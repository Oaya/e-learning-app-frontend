import React from "react";
import { useNavigate } from "react-router-dom";
import type { Homework } from "../../../../type/homework";
import { HW_BORDER_COLOR, HW_STATUS_BADGE } from "../../../../utils/constants";
import {
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineStar,
} from "react-icons/hi";
import {
  HiOutlineHandThumbUp,
  HiOutlineLanguage,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { capitalize } from "../../../../utils/helper";

type Props = {
  hw: Homework;
};

export default function StudentHomeworkCard({ hw }: Props) {
  const navigate = useNavigate();
  const SCORE_ICON: Record<string, React.ReactNode> = {
    excellent: <HiOutlineStar size={14} />,
    good: <HiOutlineHandThumbUp size={14} />,
    needs_work: <HiOutlineWrenchScrewdriver size={14} />,
  };

  const SCORE_LABEL: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    needs_work: "Needs work",
  };

  const dateLabel =
    hw.status === "reviewed" && hw.reviewed_at
      ? `Reviewed ${hw.reviewed_at}`
      : hw.status === "submitted" && hw.submitted_at
        ? `Submitted ${hw.submitted_at}`
        : `Due ${hw.due_date}`;

  // Mock feedback — replace with real API field when available
  const mockFeedback: Record<string, { text: string; score: string }> = {
    reviewed: {
      text: "Great work overall! Pay attention to て-form chaining in more complex sentences.",
      score: "good",
    },
  };
  const feedback = hw.status === "reviewed" ? mockFeedback["reviewed"] : null;

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${HW_BORDER_COLOR[hw.status]}`}
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
        {feedback && (
          <div className="mt-3 rounded-lg bg-blue-50 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
              Teacher feedback
            </p>
            <p className="text-xs leading-relaxed text-blue-800">
              {feedback.text}
            </p>
            {feedback.score && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-800">
                {SCORE_ICON[feedback.score]}
                {SCORE_LABEL[feedback.score]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[hw.status]}`}
        >
          {hw.status}
        </span>

        {(hw.status === "pending" || hw.status === "overdue") && (
          <button
            onClick={() => navigate(`/student/homework/${hw.id}/submit`)}
            className="btn-primary-pink"
          >
            Submit
          </button>
        )}

        {(hw.status === "submitted" || hw.status === "reviewed") && (
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <HiOutlineEye size={14} />
            View
          </button>
        )}
      </div>
    </div>
  );
}
