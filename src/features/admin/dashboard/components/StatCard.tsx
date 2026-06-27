import type { IconType } from "react-icons";

type StatCardProps = {
  icon?: IconType;
  iconColor?: string;
  label: string;
  value: string | number;
  sub?: string;
  subColor?: boolean;
};

export default function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sub,
  subColor,
}: StatCardProps) {
  return (
    <div className="h-32 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        {Icon && <Icon size={20} className={`h-4 w-4 ${iconColor}`} />}
        {label}
      </div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      {sub && (
        <p
          className={`mt-0.5 text-xs ${subColor ? `${iconColor}` : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
