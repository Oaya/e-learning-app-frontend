import type { IconType } from "react-icons";
import type { UploadType } from "../../homework/pages/HomeworkSubmitPage";
import { HiOutlineLink, HiOutlineVideoCamera } from "react-icons/hi";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";

type Props = {
  type: UploadType;
  label: string;
  sub: string;
  onClick: () => void;
};

const UploadIconValues: Record<
  UploadType,
  { buttonCss: string; icon: IconType; iconColor: string; iconBg: string }
> = {
  file: {
    buttonCss: "hover:border-emerald-400 hover:bg-emerald-50",
    icon: HiOutlineDocumentArrowUp,
    iconColor: "text-theme-green-20",
    iconBg: "bg-theme-green-30",
  },
  video: {
    buttonCss: "hover:border-blue-300 hover:bg-blue-50",
    icon: HiOutlineVideoCamera,
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  link: {
    buttonCss: "hover:border-gray-400 hover:bg-gray-50",
    icon: HiOutlineLink,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-100",
  },
};

export default function UploadButton({ type, label, sub, onClick }: Props) {
  const { buttonCss, icon: Icon, iconColor, iconBg } = UploadIconValues[type];
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-4 ${buttonCss}`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <p className="text-xs font-medium text-gray-700">{label}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </button>
  );
}
