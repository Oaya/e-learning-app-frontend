import { capitalize } from "@/utils/helper";

type Props = {
  status: string;
  constant: Record<string, string>;
  className?: string;
};

export default function Badge({ status, constant, className = "" }: Props) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap md:text-sm ${constant[status]} ${className}`}
    >
      {capitalize(status)}
    </span>
  );
}
