import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlinePaperClip,
  HiOutlineStar,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import {
  HiOutlineHandThumbUp,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { useHomework } from "../../../admin/homework/hooks/useHomework";
import { HW_STATUS_BADGE, HW_UPLOAD_BUTTON } from "../../../../utils/constants";

import HomeworkHeaderPanel from "../components/HomeworkHeaderPanel";
import type { AttachmentType } from "../../../../type/homework_submission";

const MOCK_FEEDBACK = {
  score: "good" as const,
  text: "Great work overall! Your sentence structure is solid and vocabulary choice is natural. Pay attention to て-form chaining in more complex sentences — for example in your third sentence you could connect two actions more fluidly.",
  reviewed_at: "2026-06-25",
};
// ─────────────────────────────────────────────────────────────────────────────

const SCORE_CONFIG = {
  excellent: {
    icon: <HiOutlineStar size={14} />,
    label: "Excellent",
    chip: "bg-emerald-50 text-emerald-700",
  },
  good: {
    icon: <HiOutlineHandThumbUp size={14} />,
    label: "Good",
    chip: "bg-blue-50 text-blue-700",
  },
  needs_work: {
    icon: <HiOutlineWrenchScrewdriver size={14} />,
    label: "Needs work",
    chip: "bg-orange-50 text-orange-700",
  },
};

export default function HomeworkViewPage() {
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";
  const navigate = useNavigate();

  const { homework, isLoading } = useHomework(hwId);

  if (isLoading || !homework) {
    return <p className="p-10 text-sm text-gray-400">Loading…</p>;
  }

  const status = homework.submission?.status ?? "pending";
  const isReviewed = status === "reviewed";

  const submission = homework.submission;

  function handleAttachment(
    type: AttachmentType,
    url: string,
    filename?: string,
  ) {
    if (type !== "link" && filename) {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (type === "link") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const feedback = isReviewed ? MOCK_FEEDBACK : null;

  const scoreConfig = feedback ? SCORE_CONFIG[feedback.score] : null;

  return (
    <div className="flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-4">
        <button
          onClick={() => navigate("/student/homework")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to homework
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${HW_STATUS_BADGE[status] ?? ""}`}
          >
            {status}
          </span>
          {!isReviewed && (
            <button
              onClick={() => navigate(`/student/homework/${hwId}/submit`)}
              className="btn-primary-white flex items-center gap-1.5"
            >
              <HiOutlinePencilSquare size={15} />
              Edit submission
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 p-10">
        {/* Header card */}
        <HomeworkHeaderPanel hw={homework} />

        {/* Two-column layout */}
        <div className="flex items-start gap-5">
          {/* LEFT — answer + attachments */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Written answer */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
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
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlinePaperClip className="h-4 w-4 text-gray-400" />
                  <p className="panel-header">Attachments</p>
                </div>
                <div className="space-y-2">
                  {submission.attachments.map((a) => {
                    const { icon: Icon, bg, color } = HW_UPLOAD_BUTTON[a.type];
                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5"
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${bg} ${color}`}
                        >
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-gray-800">
                            {a.type === "link" ? (
                              <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-theme-pink-20 hover:underline"
                              >
                                Link
                              </a>
                            ) : (
                              a.filename
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">{a.sub}</p>
                        </div>
                        <button
                          className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            handleAttachment(a.type, a.url!, a.filename)
                          }
                        >
                          {a.type === "link" ? "Open" : "Download"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — feedback + what's next */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            {/* Teacher feedback */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4 text-gray-400" />
                <p className="panel-header">Teacher feedback</p>
              </div>

              {feedback && scoreConfig ? (
                <div className="space-y-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${scoreConfig.chip}`}
                  >
                    {scoreConfig.icon}
                    {scoreConfig.label}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feedback.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    Reviewed {feedback.reviewed_at}
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
            <div className="rounded-xl border border-gray-200 bg-white p-5">
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
