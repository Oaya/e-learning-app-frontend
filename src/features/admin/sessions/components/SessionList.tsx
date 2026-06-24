import type { Session } from "../../../../type/session";
import SessionCard from "./SessionCard";

type SessionListProps = {
  type: string;
  sessions: Session[];
  // onCancel?: () => void;
  // onDelete?: () => void;
};

export default function SessionList({
  type,
  sessions,
  // onCancel,
  // onDelete,
}: SessionListProps) {
  return (
    <section>
      <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
        {type}
      </p>
      <div className="space-y-2">
        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            session={s}
            // onDelete={onDelete}
            // onCancel={onCancel}
          />
        ))}
      </div>
    </section>
  );
}
