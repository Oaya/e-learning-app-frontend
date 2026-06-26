import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineArrowDown,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";

// ── Temporary mock — replace with API call using useParams id ─────────────────
const MOCK_REVIEW = {
  id: "4",
  title: "Write 10 sentences using past tense",
  instructions:
    "Write 10 original sentences in Japanese using the past tense (た-form). Each sentence should describe something you did yesterday. Try to use a variety of verbs.",
  student_name: "Sara K.",
  student_initials: "SK",
  student_color: "bg-emerald-100 text-emerald-700",
  submitted_at: "Jun 11, 2026",
  language: "Japanese",
  level: "Intermediate",
  ai_generated: true,
  submission_text: `1. 昨日、学校に行きました。
2. 友達とランチを食べました。
3. 図書館で本を読みました。
4. バスで家に帰りました。
5. 音楽を聴きました。
6. 宿題をしました。
7. シャワーを浴びました。
8. テレビを見ました。
9. 日記を書きました。
10. 早く寝ました。`,
  attachment: {
    name: "homework_sara_jun11.pdf",
    size: "142 KB",
    type: "PDF",
  },
  ai_suggestion:
    "Great use of た-form throughout! All 10 sentences are grammatically correct. Encourage Sara to vary sentence length and add time expressions like 朝 or 午後 to make sentences more natural. Consider introducing て-form chaining in the next session.",
};

type Score = "needs_work" | "good" | "excellent" | null;

const SCORE_OPTIONS: { key: Score; label: string }[] = [
  { key: "needs_work", label: "⭐ Needs work" },
  { key: "good", label: "👍 Good" },
  { key: "excellent", label: "🌟 Excellent" },
];

export default function HomeworkReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In production replace MOCK_REVIEW with: const { data: hw } = useHomework(id)
  const hw = MOCK_REVIEW;

  const [score, setScore] = useState<Score>(null);
  const [feedback, setFeedback] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleGenerateAiFeedback() {
    setAiLoading(true);
    // TODO: replace with real Anthropic API call
    await new Promise((r) => setTimeout(r, 1000));
    setFeedback(hw.ai_suggestion);
    setAiLoading(false);
  }

  function useAiSuggestion() {
    setFeedback(hw.ai_suggestion);
  }

  async function handleMarkReviewed() {
    if (!feedback.trim()) return;
    setSaving(true);
    // TODO: API call — PATCH /api/homework/:id/review { score, feedback, private_notes }
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    navigate("/admin/homework");
  }

  async function handleSaveDraft() {
    // TODO: API call — PATCH /api/homework/:id { feedback_draft: feedback, private_notes }
    await new Promise((r) => setTimeout(r, 500));
  }

  return (
    <div className="space-y-5 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/homework")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to homework
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Save draft
          </button>
          <button
            onClick={handleMarkReviewed}
            disabled={saving || !feedback.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <HiOutlineCheck className="h-4 w-4" />
            {saving ? "Saving…" : "Mark as reviewed"}
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
        <h1 className="mb-2 text-lg font-semibold text-gray-800">{hw.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${hw.student_color}`}
            >
              {hw.student_initials}
            </div>
            <span className="text-xs text-gray-500">{hw.student_name}</span>
          </div>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">
            Submitted {hw.submitted_at}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">
            {hw.language} · {hw.level}
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            Submitted
          </span>
          {hw.ai_generated && (
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
              <HiOutlineSparkles className="h-3 w-3" /> AI generated
            </span>
          )}
        </div>
      </div>

      {/* Two column body */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
        {/* LEFT — submission */}
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Assignment instructions
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              {hw.instructions}
            </p>
          </div>

          {/* Submission */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Student's written answer
            </p>
            <div className="rounded-lg bg-gray-50 p-4 text-sm leading-loose whitespace-pre-line text-gray-800">
              {hw.submission_text}
            </div>

            {/* Attachment */}
            {hw.attachment && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                  Attached file
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <HiOutlineDocumentArrowDown className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {hw.attachment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {hw.attachment.size} · {hw.attachment.type}
                    </p>
                  </div>
                  <button className="text-xs font-medium text-emerald-600 hover:underline">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — feedback */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Score */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Score
            </p>
            <div className="flex gap-2">
              {SCORE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setScore(opt.key)}
                  className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition ${
                    score === opt.key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI suggestion */}
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="h-4 w-4 text-purple-600" />
                <p className="text-[10px] font-semibold tracking-widest text-purple-600 uppercase">
                  Claude's suggestion
                </p>
              </div>
              <button
                onClick={handleGenerateAiFeedback}
                disabled={aiLoading}
                className="rounded-lg border border-purple-200 bg-white px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
              >
                {aiLoading ? "Generating…" : "Regenerate"}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-purple-800">
              {hw.ai_suggestion}
            </p>
            <button
              onClick={useAiSuggestion}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
            >
              <HiOutlineArrowDown className="h-3.5 w-3.5" />
              Use this as feedback
            </button>
          </div>

          {/* Feedback for student */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Feedback for student
            </p>
            <textarea
              rows={5}
              placeholder="Write feedback visible to the student…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Private notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Private notes
            </p>
            <p className="mb-3 text-[11px] text-gray-400">
              Only you can see this
            </p>
            <textarea
              rows={3}
              placeholder="Notes for yourself…"
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
        <p className="text-xs text-gray-400">
          Feedback will be sent to{" "}
          <span className="font-medium text-gray-600">{hw.student_name}</span>{" "}
          when you mark as reviewed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Save draft
          </button>
          <button
            onClick={handleMarkReviewed}
            disabled={saving || !feedback.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <HiOutlineCheck className="h-4 w-4" />
            {saving ? "Saving…" : "Mark as reviewed"}
          </button>
        </div>
      </div>
    </div>
  );
}
