type Props = {
  value: string;
  status: string;
  constant: Record<string, string>;
  className?: string;
};

export default function badge({ value, status, constant, className = "" }: Props) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-sm ${constant[status]} ${className}`}
    >
      {value}
    </span>
  );
}
