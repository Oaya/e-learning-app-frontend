import { useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineLanguage,
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineHandThumbUp,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { useHomeworks } from "../../../admin/homework/hooks/useHomeworks";
import type { Homework, HomeworkStatus } from "../../../../type/homework";
import SubmitHomeworkModal from "../components/SubmitHomeworkModal";

type Filter = "all" | "overdue" | "pending" | "submitted" | "reviewed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "overdue",   label: "Overdue" },
  { key: "pending",   label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "reviewed",  label: "Reviewed" },
];

const BORDER_COLOR: Record<HomeworkStatus, string> = {
  overdue:   "border-l-red-400",
  pending:   "border-l-amber-400",
  submitted: "border-l-emerald-500",
  reviewed:  "border-l-blue-400",
};

const BADGE: Record<HomeworkStatus, string> = {
  overdue:   "bg-red-50 text-red-800",
  pending:   "bg-amber-50 text-amber-800",
  submitted: "bg-emerald-50 text-emerald-800",
  reviewed:  "bg-blue-50 text-blue-800",
};

const SCORE_ICON: Record<string, React.ReactNode> = {
  excellent:  <HiOutlineStar className="h-3.5 w-3.5" />,
  good:       <HiOutlineHandThumbUp className="h-3.5 w-3.5" />,
  needs_work: <HiOutlineWrenchScrewdriver className="h-3.5 w-3.5" />,
};

const SCORE_LABEL: Record<string, string> = {
  excellent:  "Excellent",
  good:       "Good",
  needs_work: "Needs work",
};

const STATUS_ORDER: HomeworkStatus[] = ["overdue", "pending", "submitted", "reviewed"];

const SECTION_LABEL: Record<HomeworkStatus, string> = {
  overdue:   "Overdue",
  pending:   "Pending",
  submitted: "Submitted — waiting for review",
  reviewed:  "Reviewed",
};

export default function StudentHomeworkPage() {
  const [filter, setFilter]     = useState<Filter>("all");
  const [submitHw, setSubmitHw] = useState<Homework | null>(null);

  const { homeworks = [], isLoading } = useHomeworks({});

  const total     = homeworks.length;
  const pending   = homeworks.filter((h) => h.status === "pending").length;
  const submitted = homeworks.filter((h) => h.status === "submitted").length;
  const reviewed  = homeworks.filter((h) => h.status === "reviewed").length;

  const filtered =
    filter === "all" ? homeworks : homeworks.filter((h) => h.status === filter);

  async function handleSubmit(hwId: string, text: string, file: File | null) {
    // TODO: POST /api/homeworks/:id/submit { submission_text: text, file }
    console.log("submit", { hwId, text, file });
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-gray-200 px-10 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Homework</h1>
      </div>

      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total",     val: total },
            { label: "Pending",   val: pending,   color: "text-amber-700" },
            { label: "Submitted", val: submitted, color: "text-emerald-700" },
            { label: "Reviewed",  val: reviewed,  color: "text-blue-700" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-1 text-xs text-gray-400">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color ?? "text-gray-800"}`}>
                {s.val}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                filter === f.key
                  ? "border-emerald-500 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-gray-400">Loading homework…</p>}

        {/* Grouped sections */}
        {STATUS_ORDER.filter((status) =>
          filter === "all" ? true : filter === status,
        ).map((status) => {
          const group = filtered.filter((h) => h.status === status);
          if (group.length === 0) return null;
          return (
            <div key={status}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {SECTION_LABEL[status]}
              </p>
              <div className="space-y-3">
                {group.map((hw) => (
                  <HomeworkCard
                    key={hw.id}
                    hw={hw}
                    onSubmit={() => setSubmitHw(hw)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {!isLoading && filtered.length === 0 && (
          <p className="text-sm text-gray-400">No homework found.</p>
        )}
      </div>

      {/* Submit modal */}
      {submitHw && (
        <SubmitHomeworkModal
          hw={submitHw}
          isOpen={true}
          onClose={() => setSubmitHw(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// ── Homework card ─────────────────────────────────────────────────────────────
function HomeworkCard({
  hw,
  onSubmit,
}: {
  hw: Homework;
  onSubmit: () => void;
}) {
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
      className={`rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${BORDER_COLOR[hw.status]}`}
      style={{ borderRadius: "12px" }}
    >
      <div className="flex items-start gap-4">
        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-gray-800">{hw.title}</p>
            {hw.ai_generated && (
              <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                <HiOutlineSparkles className="h-3 w-3" /> AI generated
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <HiOutlineCalendar className="h-3.5 w-3.5" />
              {dateLabel}
            </span>
            {hw.language && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <HiOutlineLanguage className="h-3.5 w-3.5" />
                {hw.language} · {hw.level}
              </span>
            )}
          </div>

          {/* Feedback for reviewed homework */}
          {feedback && (
            <div className="mt-3 rounded-lg bg-blue-50 px-4 py-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-600">
                Teacher feedback
              </p>
              <p className="text-xs leading-relaxed text-blue-800">{feedback.text}</p>
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
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${BADGE[hw.status]}`}
          >
            {hw.status}
          </span>

          {(hw.status === "pending" || hw.status === "overdue") && (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Submit
            </button>
          )}

          {(hw.status === "submitted" || hw.status === "reviewed") && (
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
              <HiOutlineEye className="h-3.5 w-3.5" />
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
