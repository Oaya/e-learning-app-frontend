import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineCheck } from "react-icons/hi2";
import { useHomeworkSubmission } from "../../../admin/homework/hooks/useHomeworkSubmission";
import HomeworkHeaderPanel from "../components/HomeworkHeaderPanel";
import AttachmentsPanel from "../components/AttachmentsPanel";
import { useAlert } from "../../../../contexts/AlertContext";
import { useHomework } from "../../../admin/homework/hooks/useHomework";
import type { Attachment } from "../../../../type/homework_submission";

export default function HomeworkSubmitPage() {
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";
  const navigate = useNavigate();
  const alert = useAlert();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { homework, isLoading } = useHomework(hwId);
  const {
    createHomeworkSubmission,
    saveHomeworkSubmission,
    isCreating,
    isSaving,
  } = useHomeworkSubmission({
    onCreateSuccess: () => {
      alert.success("Homework Submission created successfully.");
      navigate("/student/homework");
    },
  });

  function addAttachment(a: Omit<Attachment, "id">) {
    setAttachments((prev) => [...prev, { ...a, id: crypto.randomUUID() }]);
  }

  function removeAttachment(attachId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attachId));
  }

  async function handleSubmit() {
    if (!text.trim() && attachments.length === 0) return;
    try {
      await createHomeworkSubmission({
        homework_id: hwId,
        answer_text: text || undefined,
        status: "submitted",
        attachments: attachments.map((a) => ({
          type: a.type,
          file: a.file,
          url: a.url,
        })),
      });
    } catch (error) {
      alert.error("Failed to save Homework Submission. Try again later.");
    }
  }

  async function handleSaveDraft() {
    try {
      await saveHomeworkSubmission({
        homework_id: hwId,
        status: "draft",
        answer_text: text || undefined,
        attachments: attachments.map((a) => ({
          type: a.type,
          file: a.file,
          url: a.url,
        })),
      });
    } catch (error) {
      alert.error("Failed to autosave Homework Submission. Try again later.");
    }
  }

  const canSubmit = text.trim().length > 0 || attachments.length > 0;

  if (isLoading || !homework)
    return <p className="p-10 text-sm text-gray-400">Loading…</p>;

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
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2">
            <button onClick={handleSaveDraft} className="btn-primary-white">
              {isSaving ? "Saving…" : "Save draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating || !canSubmit}
              className="btn-primary-pink"
            >
              <HiOutlineCheck size={16} />
              {isCreating ? "Submitting…" : "Submit"}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            You can edit your submission until your teacher reviews it.
          </p>
        </div>
      </div>
      <div className="space-y-5 p-10">
        <HomeworkHeaderPanel hw={homework} />

        <div className="flex items-stretch gap-5">
          {/* Written answer */}
          <div className="flex shrink-0 grow-0 basis-[65%] flex-col rounded-xl border border-gray-200 bg-white p-5">
            <p className="panel-header">Written answer</p>
            <textarea
              placeholder="Write your answer here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-90 w-full flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-relaxed text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
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
