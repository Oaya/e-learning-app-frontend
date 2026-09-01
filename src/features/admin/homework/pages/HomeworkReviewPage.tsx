import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

import { useHomework } from "@/features/shared/homeworks/hooks/useHomework";
import { SCORE_BUDGE } from "@/utils/constants";
import AttachmentsList from "@/features/shared/homeworks/components/AttachmentsList";
import type { ScoreType } from "@/type/homework_submission";
import { useAlert } from "@/contexts/AlertContext";
import { useHomeworkSubmission } from "@/features/shared/homeworks/hooks/useHomeworkSubmission";
import HomeworkHeaderPanel from "@/features/shared/homeworks/components/HomeworkHeaderPanel";
import { capitalize } from "@/utils/helper";

export default function HomeworkReviewPage() {
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";

  const [score, setScore] = useState<ScoreType | null>(null);
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");

  const { homework, isLoading } = useHomework(hwId);
  const { submitFeedback, isSubmittingFeedback } = useHomeworkSubmission(hwId, {
    onSubmitFeedbackSuccess: () => {
      navigate("/admin/homework");
    },
  });
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
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        <button
          onClick={() => navigate("/admin/homework")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <HiOutlineArrowLeft size={16} />
          <span className="hidden sm:inline">Back to homework</span>
          <span className="sm:hidden">Back</span>
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

      <div className="space-y-6">
        {/* Header card */}
        <HomeworkHeaderPanel hw={homework} />

        {/* Two column body */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT — submission */}
          <div className="space-y-4">
            {/* Submission */}
            <div className="panel-box">
              <p className="panel-header">Student's written answer</p>
              <div className="rounded-lg text-sm leading-loose whitespace-pre-line text-gray-800">
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
              <div className="mt-2 flex gap-2">
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
                    <div className="flex justify-center gap-1 capitalize">
                      <value.icon size={16} />
                      <span>{capitalize(key)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback for student */}
            <div className="panel-box">
              <p className="panel-header">Feedback for student</p>
              <textarea
                rows={3}
                placeholder="Write feedback visible to the student…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="form-textarea mt-2"
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
