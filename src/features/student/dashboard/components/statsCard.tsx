type Props = {
  icon: string;
  label: string;
  value: number | string;
  sub?: string;
};

export default function StatCard({ icon, label, value, sub }: Props) {
  return (
    <div className="rounded border bg-gray-400 px-6 py-8">
      <div className="text-md mb-2">{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p>{label}</p>
      {sub && <p>{sub}</p>}
    </div>
  );
}
