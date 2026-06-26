import dayjs from "dayjs";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Session } from "../../../../type/session";

type UpcomingSessionPanelProps = {
  sessions?: Session[];
};

export default function UpcomingSessionPanel({
  sessions,
}: UpcomingSessionPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Upcoming sessions
        </p>
        <Link
          to="/student/sessions"
          className="text-theme-green-20 flex items-center gap-1 text-xs hover:underline"
        >
          View all <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {sessions?.length === 0 ? (
        <p className="text-sm text-gray-400">No upcoming sessions.</p>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          {sessions?.map((s) => {
            const dt = dayjs(s.scheduled_at);
            return (
              <div key={s.id} className="flex items-center gap-4 py-3">
                <div className="min-w-10 text-center">
                  <p className="text-lg leading-none font-semibold text-gray-800">
                    {dt.format("D")}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    {dt.format("MMM")}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {dt.format("h:mm A")} · {s.duration_in_minutes} min
                  </p>
                  <p className="text-xs text-gray-400">{s.topic}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  Scheduled
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
