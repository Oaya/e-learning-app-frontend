type Props = {
  status: string;
  constant: Record<string, string>;
  className?: string;
};

export default function badge({ status, constant, className = "" }: Props) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-sm capitalize ${constant[status]} ${className}`}
    >
      {status}
    </span>
  );
}
