import {
  HiOutlinePencil,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineTrash,
} from "react-icons/hi";
import ActionBtn from "./ActionButton";
import type { Session } from "../../../../type/session";
import {
  capitalize,
  formatDay,
  formatTime,
  initials,
} from "../../../../utils/helper";

const BORDER_COLOR: Record<string, string> = {
  scheduled: "border-l-theme-green-20",
  completed: "border-l-gray-300",
  cancelled: "border-l-theme-pink-20",
  no_show: "border-l-theme-yellow-20",
};

const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-emerald-50 text-emerald-700",
  completed: "bg-gray-100  text-gray-500",
  cancelled: "bg-red-50    text-red-600",
  no_show: "bg-amber-50  text-amber-700",
};

type Props = {
  session: Session;
};

function handleCancel(session: Session) {
  // setSessions((prev) =>
  //   prev.map((s) =>
  //     s.id === session.id ? { ...s, status: "cancelled" as const } : s,
  //   ),
  // );
}

function handleDelete(session: Session) {
  // setSessions((prev) => prev.filter((s) => s.id !== session.id));
}

function handleEdit(session: Session) {
  // setSessions((prev) => prev.filter((s) => s.id !== session.id));
}

export default function SessionCard({ session }: Props) {
  const { day, mon } = formatDay(session.scheduled_at);
  const isPast =
    session.status === "completed" || session.status === "cancelled";

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${BORDER_COLOR[session.status]}`}
      style={{ opacity: session.status === "cancelled" ? 0.7 : 1 }}
    >
      {/* Date block */}
      <div className="w-12 shrink-0 text-center">
        <div className="text-2xl leading-none font-semibold text-gray-800">
          {day}
        </div>
        <div className="text-[11px] tracking-wide text-gray-400 uppercase">
          {mon}
        </div>
      </div>

      {/* Divider */}
      <div className="h-10 w-px shrink-0 bg-gray-200" />

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">
          {session.topic}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineVideoCamera className="h-3.5 w-3.5" />
            {formatTime(session.scheduled_at)} · {session.duration_in_minutes}{" "}
            min
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            {session.student.avatar ? (
              <img
                src={session.student.avatar}
                alt="avatar"
                className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
              />
            ) : (
              <span className="bg-theme-pink-10 text-theme-pink-20 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold">
                {initials(
                  session.student.first_name,
                  session.student.last_name,
                )}
              </span>
            )}
            {session.student.first_name} {session.student.last_name}
          </span>
          {/* {session.has_recording && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <HiOutlineVideoCamera className="h-3.5 w-3.5" /> Recording
            </span>
          )} */}
        </div>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[session.status]}`}
        >
          {capitalize(session.status)}
        </span>
        {/* <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            session.payment_status === "paid"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {session.payment_status === "paid" ? "Paid" : "Unpaid"}
        </span> */}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isPast && (
          <>
            <ActionBtn title="Edit" onClick={() => handleEdit(session)}>
              <HiOutlinePencil className="h-4 w-4" />
            </ActionBtn>
            <ActionBtn
              title="Cancel session"
              onClick={() => handleCancel(session)}
            >
              <HiOutlineX className="h-4 w-4" />
            </ActionBtn>
          </>
        )}
        {isPast && (
          <>
            <ActionBtn title="Notes">
              <HiOutlineDocumentText className="h-4 w-4" />
            </ActionBtn>
            {/* {session.has_recording && (
              <ActionBtn title="View recording">
                <HiOutlineVideoCamera className="h-4 w-4" />
              </ActionBtn>
            )} */}
            <ActionBtn title="Edit" onClick={() => handleEdit(session)}>
              <HiOutlinePencil className="h-4 w-4" />
            </ActionBtn>
            {session.status === "cancelled" && (
              <ActionBtn title="Delete" onClick={() => handleDelete(session)}>
                <HiOutlineTrash className="h-4 w-4" />
              </ActionBtn>
            )}
          </>
        )}
      </div>
    </div>
  );
}
