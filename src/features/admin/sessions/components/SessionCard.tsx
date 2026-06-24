import {
  HiOutlinePencil,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineTrash,
} from "react-icons/hi";
import type { Session } from "../types/session";

const AVATAR_COLOR: Record<string, string> = {
  green:  "bg-emerald-100 text-emerald-700",
  blue:   "bg-blue-100   text-blue-700",
  amber:  "bg-amber-100  text-amber-700",
  pink:   "bg-pink-100   text-pink-700",
  purple: "bg-purple-100 text-purple-700",
};

const BORDER_COLOR: Record<string, string> = {
  scheduled:  "border-l-emerald-500",
  completed:  "border-l-gray-300",
  cancelled:  "border-l-red-400",
  no_show:    "border-l-amber-400",
};

const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-emerald-50 text-emerald-700",
  completed: "bg-gray-100  text-gray-500",
  cancelled: "bg-red-50    text-red-600",
  no_show:   "bg-amber-50  text-amber-700",
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Upcoming",
  completed: "Done",
  cancelled: "Cancelled",
  no_show:   "No show",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDay(iso: string) {
  const d = new Date(iso);
  return { day: d.getDate(), mon: d.toLocaleString("en-GB", { month: "short" }) };
}

type Props = {
  session: Session;
  onEdit?: (s: Session) => void;
  onCancel?: (s: Session) => void;
  onDelete?: (s: Session) => void;
};

export default function SessionCard({ session, onEdit, onCancel, onDelete }: Props) {
  const { day, mon } = formatDay(session.scheduled_at);
  const isPast = session.status === "completed" || session.status === "cancelled" || session.status === "no_show";

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 border-l-4 ${BORDER_COLOR[session.status]}`}
      style={{ opacity: session.status === "cancelled" ? 0.7 : 1 }}
    >
      {/* Date block */}
      <div className="w-12 shrink-0 text-center">
        <div className="text-2xl font-semibold leading-none text-gray-800">{day}</div>
        <div className="text-[11px] uppercase tracking-wide text-gray-400">{mon}</div>
      </div>

      {/* Divider */}
      <div className="h-10 w-px shrink-0 bg-gray-200" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{session.topic}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineVideoCamera className="h-3.5 w-3.5" />
            {formatTime(session.scheduled_at)} · {session.duration_in_minutes} min
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${AVATAR_COLOR[session.student_color]}`}
            >
              {session.student_initials}
            </span>
            {session.student_name}
          </span>
          {session.has_recording && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <HiOutlineVideoCamera className="h-3.5 w-3.5" /> Recording
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[session.status]}`}>
          {STATUS_LABEL[session.status]}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            session.payment_status === "paid"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {session.payment_status === "paid" ? "Paid" : "Unpaid"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isPast && (
          <>
            <ActionBtn title="Edit" onClick={() => onEdit?.(session)}>
              <HiOutlinePencil className="h-4 w-4" />
            </ActionBtn>
            <ActionBtn title="Cancel session" onClick={() => onCancel?.(session)}>
              <HiOutlineX className="h-4 w-4" />
            </ActionBtn>
          </>
        )}
        {isPast && (
          <>
            <ActionBtn title="Notes">
              <HiOutlineDocumentText className="h-4 w-4" />
            </ActionBtn>
            {session.has_recording && (
              <ActionBtn title="View recording">
                <HiOutlineVideoCamera className="h-4 w-4" />
              </ActionBtn>
            )}
            <ActionBtn title="Edit" onClick={() => onEdit?.(session)}>
              <HiOutlinePencil className="h-4 w-4" />
            </ActionBtn>
            {session.status === "cancelled" && (
              <ActionBtn title="Delete" onClick={() => onDelete?.(session)}>
                <HiOutlineTrash className="h-4 w-4" />
              </ActionBtn>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
    >
      {children}
    </button>
  );
}
