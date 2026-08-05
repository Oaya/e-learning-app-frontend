import { capitalize } from "../utils/helper";

type Props = {
  status: string;
  constant: Record<string, string>;
  className?: string;
};

export default function Badge({ status, constant, className = "" }: Props) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-sm ${constant[status]} ${className}`}
    >
      {capitalize(status)}
    </span>
  );
}
