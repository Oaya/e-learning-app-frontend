import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineSparkles } from "react-icons/hi2";
import { useHomework } from "../hooks/useHomework";
import { initials } from "../../../../utils/helper";
import { HW_STATUS_BADGE, SCORE_BUDGE } from "../../../../utils/constants";
import AttachmentsList from "../../../student/homework/components/AttachmentsList";
import type { ScoreType } from "../../../../type/homework_submission";
import { useAlert } from "../../../../contexts/AlertContext";
import { useHomeworkSubmission } from "../hooks/useHomeworkSubmission";
import Badge from "../../../../ui/badge";

export default function HomeworkReviewPage() {
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";

  const [score, setScore] = useState<ScoreType | null>(null);
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const { homework, isLoading } = useHomework(hwId);
  const { submitFeedback, isSubmittingFeedback } = useHomeworkSubmission(hwId);
  const submission = homework?.submission;

  useEffect(() => {
    if (submission?.feedback) {
      setScore(submission.feedback.score ?? null);
      setFeedback(submission.feedback.feedback_text ?? "");
      setNotes(submission.feedback.notes ?? "");
    }
  }, [submission]);

  if (isLoading || !homework || !submission) {
    return <p className="p-10 text-sm text-gray-400">Loading…</p>;
  }

  const status = submission ? submission.status : "pending";

  async function handleGenerateAiFeedback() {
    setAiLoading(true);
    // TODO: replace with real Anthropic API call
    await new Promise((r) => setTimeout(r, 1000));
    // setFeedback(homework.ai_suggestion);
    setAiLoading(false);
  }

  // function useAiSuggestion() {
  //   setFeedback(homework.ai_suggestion);
  // }

  async function handleMarkReviewed() {
    try {
      if (!submission?.id) {
        alert.error("We couldn't find the submission");
        return;
      }

      if (!score) {
        alert.error("We need value of score");
        return;
      }

      await submitFeedback({
        submission_id: submission.id,
        score,
        feedback,
        notes,
      });
    } catch {
      //handle error
    }
  }

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/homework")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          Back to homework
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleMarkReviewed}
            disabled={isSubmittingFeedback || !feedback.trim()}
            className="btn-primary"
          >
            {isSubmittingFeedback ? "Saving…" : "Mark as reviewed"}
          </button>
        </div>
      </section>

      {/* Header card */}
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
          <div className="flex justify-between">
            <h1 className="mb-2 text-lg font-semibold text-gray-800">
              {homework.title}
            </h1>

            <Badge
              status={status}
              constant={HW_STATUS_BADGE}
              className="h-fit"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              {homework.student.avatar ? (
                <img
                  src={homework.student.avatar}
                  alt="avatar"
                  className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
                />
              ) : (
                <span className="bg-theme-pink-10 text-theme-pink-20 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold">
                  {initials(
                    homework.student.first_name,
                    homework.student.last_name,
                  )}
                </span>
              )}
              {homework.student.first_name} {homework.student.last_name}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {homework.language} · {homework.level}
            </span>

            {homework.ai_generated && (
              <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                <HiOutlineSparkles className="h-3 w-3" /> AI generated
              </span>
            )}

            <span className="ml-auto text-xs text-gray-400">
              Submitted at {homework.submission?.submitted_at}
            </span>
          </div>
        </div>
        {/* Two column body */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT — submission */}
          <div className="space-y-4">
            {/* Instructions */}
            <div className="panel-box">
              <p className="panel-header">Assignment instructions</p>
              <p className="text-sm leading-relaxed text-gray-500">
                {homework.instructions}
              </p>
            </div>

            {/* Submission */}
            <div className="panel-box">
              <p className="panel-header">Student's written answer</p>
              <div className="rounded-lg bg-gray-50 p-4 text-sm leading-loose whitespace-pre-line text-gray-800">
                {homework.submission?.answer_text}
              </div>

              {homework.submission?.attachments &&
                homework.submission.attachments.length > 0 && (
                  <div className="mt-4">
                    <AttachmentsList
                      atts={homework.submission.attachments}
                      title="attached file"
                    />
                  </div>
                )}
            </div>
          </div>

          {/* RIGHT — feedback */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Score */}
            <div className="panel-box">
              <p className="panel-header">Score</p>
              <div className="flex gap-2">
                {Object.entries(SCORE_BUDGE).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setScore(key as ScoreType)}
                    className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition ${
                      score === key
                        ? value.css
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-center gap-2 capitalize">
                      <value.icon size={18} />
                      <span>{key}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI suggestion */}
            <div className="bg-theme-purple-30 rounded-xl border border-purple-100 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-theme-purple-50 h-4 w-4" />
                  <p className="text-theme-purple-50 text-[10px] font-semibold tracking-widest uppercase">
                    AI's suggestion
                  </p>
                </div>
                <button
                  onClick={handleGenerateAiFeedback}
                  disabled={aiLoading}
                  className="border-theme-purple-10 text-theme-purple-50 hover:bg-theme-purple-10 rounded-lg border bg-white px-3 py-1 text-xs font-medium disabled:opacity-50"
                >
                  {aiLoading ? "Generating…" : "Regenerate"}
                </button>
              </div>
              {/* <p className="text-xs leading-relaxed text-purple-800">
                {homework.ai_suggestion}
              </p> */}
              {/* <button
                onClick={useAiSuggestion}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
              >
                <HiOutlineArrowDown size={14} />
                Use this as feedback
              </button> */}
            </div>

            {/* Feedback for student */}
            <div className="panel-box">
              <p className="panel-header">Feedback for student</p>
              <textarea
                rows={3}
                placeholder="Write feedback visible to the student…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* Private notes */}
            <div className="panel-box">
              <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                Private notes
              </p>
              <p className="mb-3 text-[11px] text-gray-400">
                Only you can see this
              </p>
              <textarea
                rows={2}
                placeholder="Notes for yourself…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
