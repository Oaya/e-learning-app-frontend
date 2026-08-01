import { HW_UPLOAD_BUTTON } from "../../../../utils/constants";
import type {
  Attachment,
  AttachmentType,
} from "../../../../type/homework_submission";

type Props = { atts: Attachment[]; title: string };

export default function AttachmentsList({ atts, title }: Props) {
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
  return (
    <div>
      <p className="panel-header">{title}</p>
      <div className="mt-4 space-y-2">
        {atts.map((a) => {
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
                onClick={() => handleAttachment(a.type, a.url!, a.filename)}
              >
                {a.type === "link" ? "Open" : "Download"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
