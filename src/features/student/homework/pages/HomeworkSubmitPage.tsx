import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineCheck } from "react-icons/hi2";
import { useHomeworkSubmission } from "@/features/shared/homeworks/hooks/useHomeworkSubmission";
import HomeworkHeaderPanel from "@/features/shared/homeworks/components/HomeworkHeaderPanel";
import AttachmentsPanel from "@/features/student/homework/components/AttachmentsPanel";
import { useAlert } from "@/contexts/AlertContext";
import { useHomework } from "@/features/shared/homeworks/hooks/useHomework";
import type { Attachment } from "@/type/homework_submission";

export default function HomeworkSubmitPage() {
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";
  const navigate = useNavigate();
  const alert = useAlert();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { homework, isLoading } = useHomework(hwId);

  const submission = homework?.submission;

  useEffect(() => {
    if (submission) {
      setText(submission.answer_text ?? "");
      setAttachments(submission.attachments ?? []);
    }
  }, [submission]);

  const { saveDraft, submitHomework, isSavingDraft, isSubmitting } =
    useHomeworkSubmission(hwId, {
      onSaveDraftSuccess: () => alert.success("Draft saved."),
      onSubmitSuccess: () => {
        alert.success("Homework submitted successfully.");
        navigate("/student/homework");
      },
    });

  function addAttachment(a: Omit<Attachment, "id">) {
    setAttachments((prev) => [...prev, { ...a, id: crypto.randomUUID() }]);
  }

  function removeAttachment(attachId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attachId));
  }

  const submissionData = {
    homework_id: hwId,
    answer_text: text,
    attachments: attachments.map((a) => ({
      id: a.id,
      type: a.type,
      file: a.file,
      url: a.url,
      sub: a.sub,
    })),
  };

  async function handleSaveDraft() {
    try {
      await saveDraft({ ...submissionData, status: "draft" });
    } catch {
      alert.error("Failed to save draft. Try again later.");
    }
  }

  async function handleSubmit() {
    if (!text.trim() && attachments.length === 0) return;
    try {
      await submitHomework({ ...submissionData, status: "submitted" });
    } catch {
      alert.error("Failed to submit homework. Try again later.");
    }
  }

  const canSubmit = text.trim().length > 0 || attachments.length > 0;

  if (isLoading || !homework)
    return <p className="p-10 text-sm text-gray-400">Loading…</p>;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row flex-nowrap items-start gap-4 md:gap-6">
        <button
          onClick={() => navigate("/student/homework")}
          className="flex shrink-0 items-center gap-1 text-gray-500 hover:text-gray-700 md:gap-2"
        >
          <HiOutlineArrowLeft size={16} />
          <span className="hidden sm:inline">Back to homework</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              className="btn-white"
            >
              {isSavingDraft ? "Saving…" : "Save draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSavingDraft || !canSubmit}
              className="btn-primary-pink"
            >
              <HiOutlineCheck size={16} />
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
          <p className="hidden text-xs text-gray-400 sm:block">
            You can edit your submission until your teacher reviews it.
          </p>
        </div>
      </section>

      <div className="space-y-4 md:space-y-6">
        <HomeworkHeaderPanel hw={homework} />

        <div className="items-stretch gap-6 md:flex">
          {/* Written answer */}
          <div className="panel-box flex shrink-0 grow-0 basis-[60%] flex-col max-sm:mb-4">
            <p className="panel-header mb-2">Written answer</p>
            <textarea
              placeholder="Write your answer here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea md:min-h-90"
            />
          </div>

          <AttachmentsPanel
            attachments={attachments}
            onAdd={addAttachment}
            onRemove={removeAttachment}
          />
        </div>
      </div>
    </div>
  );
}
