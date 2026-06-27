import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineLink,
  HiOutlineVideoCamera,
  HiOutlineDocumentArrowUp,
  HiOutlineXMark,
  HiOutlineCalendar,
  HiOutlineLanguage,
} from "react-icons/hi2";
import { useHomework } from "../../../admin/homework/hooks/useHomework";
import HomeworkHeaderPanel from "../../lessons/components/HomeworkHeaderPanel";
import UploadButton from "../../lessons/components/UploadButton";

const UPLOAD_TYPE = ["file", "video", "link"] as const;
export type UploadType = (typeof UPLOAD_TYPE)[number];

type Attachment = {
  id: string;
  kind: UploadType;
  label: string;
  sub: string;
};

const KIND_STYLE: Record<UploadType, { bg: string; color: string }> = {
  file: { bg: "bg-emerald-100", color: "text-emerald-700" },
  video: { bg: "bg-blue-100", color: "text-blue-700" },
  link: { bg: "bg-gray-100", color: "text-gray-600" },
};

export default function HomeworkSubmitPage() {
  const { id } = useParams<{ id: string }>();
  const hwId = id ?? "";
  const navigate = useNavigate();

  const { homework, isLoading } = useHomework(hwId);

  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  function addAttachment(a: Omit<Attachment, "id">) {
    setAttachments((prev) => [...prev, { ...a, id: crypto.randomUUID() }]);
  }

  function removeAttachment(attachId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attachId));
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: UploadType,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    addAttachment({
      kind,
      label: file.name,
      sub: `${(file.size / 1024 / 1024).toFixed(1)} MB · ${KIND_LABEL[kind]}`,
    });
    e.target.value = "";
  }

  function handleAddLink() {
    if (!linkInput.trim()) return;
    const url = linkInput.startsWith("http")
      ? linkInput
      : `https://${linkInput}`;
    const isGoogleDoc = url.includes("docs.google.com");
    addAttachment({
      kind: "link",
      label: isGoogleDoc ? "Google Doc" : linkInput,
      sub: new URL(url).hostname + (isGoogleDoc ? " · Google Doc" : ""),
    });
    setLinkInput("");
  }

  async function handleSubmit() {
    if (!text.trim() && attachments.length === 0) return;
    setSubmitting(true);
    // TODO: POST /api/homeworks/:id/submit { submission_text: text, attachments }
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    navigate("/student/homework");
  }

  async function handleSaveDraft() {
    setSaving(true);
    // TODO: PATCH /api/homeworks/:id { draft_text: text }
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
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
        <div className="flex gap-2">
          <button onClick={handleSaveDraft} className="btn-primary-white">
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
            className="btn-primary-pink"
          >
            <HiOutlineCheck size={16} />
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      <div className="space-y-5 p-10">
        {/* Header card */}
        <HomeworkHeaderPanel hw={homework} />

        <div className="flex items-stretch gap-5">
          {/* Written answer — wide */}
          <div
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-5"
            style={{ flex: "0 0 65%" }}
          >
            <p className="panel-header">Written answer</p>
            <textarea
              placeholder="Write your answer here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-90 w-full flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-relaxed text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Attachments  */}
          <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-5">
            <p className="panel-header">Attachments</p>

            {/* 3 upload buttons */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              <UploadButton
                type="file"
                onClick={() => fileRef.current?.click()}
                label="Upload file"
                sub="PDF, Word, image…"
                iconBg="bg-emerald-100"
              />

              <UploadButton
                type="video"
                onClick={() => videoRef.current?.click()}
                label="Video"
                sub="MP4 or link"
                iconBg="bg-blue-100"
              />

              <UploadButton
                type="link"
                onClick={() => document.getElementById("link-input")?.focus()}
                label="Link"
                sub="Google Docs, any URL"
              />
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => handleFileChange(e, "file")}
            />
            <input
              ref={videoRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={(e) => handleFileChange(e, "video")}
            />

            {/* Link input — directly under the 3 buttons */}
            <div className="mb-2 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] text-gray-400">or paste a link</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="mb-4 flex gap-2">
              <input
                id="link-input"
                type="url"
                placeholder="https://docs.google.com/… or any URL"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
              />
              <button
                onClick={handleAddLink}
                disabled={!linkInput.trim()}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {/* Attached items */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${KIND_STYLE[a.kind].bg} ${KIND_STYLE[a.kind].color}`}
                    >
                      {a.kind === "file" && (
                        <HiOutlineDocumentArrowUp className="h-3.5 w-3.5" />
                      )}
                      {a.kind === "video" && (
                        <HiOutlineVideoCamera className="h-3.5 w-3.5" />
                      )}
                      {a.kind === "link" && (
                        <HiOutlineLink className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-800">
                        {a.label}
                      </p>
                      <p className="text-[10px] text-gray-400">{a.sub}</p>
                    </div>
                    <button
                      onClick={() => removeAttachment(a.id)}
                      className="text-gray-300 hover:text-red-400"
                    >
                      <HiOutlineXMark size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
          <p className="text-xs text-gray-400">
            You can edit your submission until your teacher reviews it.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <HiOutlineCheck size={16} />
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
