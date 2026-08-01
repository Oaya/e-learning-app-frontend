import { useRef, useState } from "react";
import UploadButton from "./UploadButton";
import HomeworkAttachedFiles from "./HomeworkAttachedFiles";

import type {
  Attachment,
  AttachmentType,
  HomeworkAttachmentInput,
} from "../../../../type/homework_submission";
import { capitalize } from "../../../../utils/helper";

type Props = {
  attachments: Attachment[];
  onAdd: (a: Omit<HomeworkAttachmentInput, "id">) => void;
  onRemove: (id: string) => void;
};

export default function AttachmentsPanel({
  attachments,
  onAdd,
  onRemove,
}: Props) {
  const [linkInput, setLinkInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: AttachmentType,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd({
      type: type,
      sub: `${(file.size / 1024 / 1024).toFixed(1)} MB · ${capitalize(type)}`,
      file,
    });
    e.target.value = "";
  }

  function handleAddLink() {
    if (!linkInput.trim()) return;
    const url = linkInput.startsWith("http")
      ? linkInput
      : `https://${linkInput}`;
    onAdd({
      type: "link",
      sub: new URL(url).hostname,
      url,
    });
    setLinkInput("");
  }

  return (
    <div className="panel-box flex flex-1 flex-col">
      <p className="panel-header">Attachments</p>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <UploadButton
          type="file"
          onClick={() => fileRef.current?.click()}
          label="Upload file"
          sub="PDF, Word, image…"
        />
        <UploadButton
          type="video"
          onClick={() => videoRef.current?.click()}
          label="Video"
          sub="MP4 or webm"
        />
        <UploadButton
          type="link"
          onClick={() => document.getElementById("link-input")?.focus()}
          label="Link"
          sub="Google Docs, any URL"
        />
      </div>

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
        accept="video/mp4,video/webm"
        onChange={(e) => handleFileChange(e, "video")}
      />

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
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-emerald-400 focus:outline-none"
        />
        <button
          onClick={handleAddLink}
          disabled={!linkInput.trim()}
          className="btn-primary-pink"
        >
          Add
        </button>
      </div>

      {attachments.length > 0 && (
        <HomeworkAttachedFiles attachments={attachments} onRemove={onRemove} />
      )}
    </div>
  );
}
