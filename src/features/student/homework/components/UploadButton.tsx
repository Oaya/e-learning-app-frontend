import { HW_UPLOAD_BUTTON } from "../../../../utils/constants";
import type { UploadType } from "../pages/HomeworkSubmitPage";

type Props = {
  type: UploadType;
  label: string;
  sub: string;
  onClick: () => void;
};

export default function UploadButton({ type, label, sub, onClick }: Props) {
  const { buttonCss, icon: Icon, color, bg } = HW_UPLOAD_BUTTON[type];
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-4 ${buttonCss}`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
      >
        <Icon size={16} className={color} />
      </div>
      <p className="text-xs font-medium text-gray-700">{label}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </button>
  );
}
