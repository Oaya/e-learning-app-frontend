import { HiOutlineXMark } from "react-icons/hi2";
import { HW_UPLOAD_BUTTON } from "../../../../utils/constants";
import type { Attachment } from "../../../../type/homework_submission";

type Props = {
  attachments: Attachment[];
  onRemove: (id: string) => void;
};

export default function HomeworkAttachedFiles({
  attachments,
  onRemove,
}: Props) {
  return (
    <div className="mt-4 space-y-2">
      {attachments.map((a) => {
        const { icon: Icon, bg, color } = HW_UPLOAD_BUTTON[a.type];
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
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
                  a.file?.name
                )}
              </p>
              <p className="text-[10px] text-gray-400">{a.sub}</p>
            </div>
            <button
              onClick={() => onRemove(a.id)}
              className="text-gray-300 hover:text-black"
            >
              <HiOutlineXMark size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
