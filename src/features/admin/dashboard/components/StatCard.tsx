export default function StatCard({
  icon,
  label,
  value,
  sub,
  subColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  subColor?: boolean;
}) {
  return (
    <div className="h-40 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      {sub && (
        <p
          className={`mt-0.5 text-xs ${subColor ? "text-theme-yellow-20" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
