import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { useHomework } from "../../../admin/homework/hooks/useHomework";

import { SCORE_BUDGE } from "../../../../utils/constants";
import HomeworkHeaderPanel from "../components/HomeworkHeaderPanel";
import AttachmentsList from "../components/AttachmentsList";
import type { ScoreType } from "../../../../type/homework_submission";

export default function HomeworkViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";

  const { homework, isLoading } = useHomework(hwId);

  if (isLoading || !homework) {
    return <p className="p-10 text-sm text-gray-400">Loading…</p>;
  }

  const submission = homework.submission;
  const isReviewed = homework.status === "reviewed";

  const feedback = isReviewed ? submission?.feedback : null;
  const scoreBadge =
    SCORE_BUDGE[homework.submission?.feedback?.score as ScoreType];

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/student/homework")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to homework
        </button>
        <div className="flex items-center gap-3">
          {!isReviewed && (
            <button
              onClick={() => navigate(`/student/homework/${hwId}/submit`)}
              className="btn-white flex items-center gap-1.5"
            >
              <HiOutlinePencilSquare size={15} />
              Edit submission
            </button>
          )}
        </div>
      </section>

      <div className="space-y-6">
        {/* Header card */}
        <HomeworkHeaderPanel hw={homework} />

        {/* Two-column layout */}
        <div className="flex items-start gap-5">
          {/* LEFT — answer + attachments */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Written answer */}
            <div className="panel-box">
              <div className="mb-3 flex items-center justify-between">
                <p className="panel-header">Your answer</p>
              </div>
              {submission?.answer_text ? (
                <p className="min-h-40 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                  {submission.answer_text}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No written answer.
                </p>
              )}
            </div>

            {/* Attachments */}
            {submission?.attachments && submission.attachments.length > 0 && (
              <div className="panel-box">
                <AttachmentsList
                  atts={submission.attachments}
                  title="Attachments"
                />
              </div>
            )}
          </div>

          {/* RIGHT — feedback + what's next */}
          <div className="flex w-100 shrink-0 flex-col gap-4">
            {/* Teacher feedback */}
            <div className="panel-box">
              <div className="flex gap-2">
                <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4 text-gray-400" />
                <p className="panel-header">Teacher feedback</p>
              </div>

              {submission && feedback ? (
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm font-medium capitalize ${scoreBadge.css}`}
                  >
                    <scoreBadge.icon size={14} />
                    {homework!.submission!.feedback.score}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feedback.feedback_text}
                  </p>
                  <p className="text-xs text-gray-400">
                    Reviewed {submission?.reviewed_at}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-5 text-center">
                  <p className="text-sm text-gray-400">
                    Your teacher hasn't reviewed this yet.
                  </p>
                  <p className="mt-1 text-xs text-gray-300">
                    Check back after your next lessons.
                  </p>
                </div>
              )}
            </div>

            {/* What's next */}
            <div className="panel-box">
              <p className="panel-header mb-2">What's next</p>
              <p className="text-sm text-gray-500">
                Your next lesson is coming up. Keep practising until then!
              </p>
              <button
                onClick={() => navigate("/student/lessons")}
                className="text-theme-green-20 mt-3 text-xs font-medium hover:underline"
              >
                View lessons →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
