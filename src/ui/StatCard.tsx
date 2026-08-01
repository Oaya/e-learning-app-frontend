import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type StatCardProps = {
  icon?: IconType;
  label: string;
  value: string | number;
  sub?: ReactNode;
  subColor?: boolean;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  subColor,
}: StatCardProps) {
  return (
    <div className="h-32 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        {Icon && <Icon size={16} className="text-theme-green-20" />}
        {label}
      </div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      {sub && (
        <p
          className={`mt-0.5 text-xs ${subColor ? "text-theme-green-20" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
