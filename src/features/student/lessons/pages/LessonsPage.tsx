import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineClock, HiOutlineVideoCamera } from "react-icons/hi2";
import { LuLanguages } from "react-icons/lu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getLessons } from "../../../../api/lessons";
import type { Lesson, LessonStatus } from "../../../../type/lesson";

dayjs.extend(relativeTime);

type Filter = "all" | "scheduled" | "completed" | "canceled";

const STATUS_BADGE: Record<LessonStatus, string> = {
  scheduled: "bg-emerald-50 text-emerald-800",
  completed: "bg-gray-100 text-gray-600",
  done: "bg-gray-100 text-gray-600",
  canceled: "bg-amber-50 text-amber-800",
};

const STATUS_LABEL: Record<LessonStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  done: "Completed",
  canceled: "Cancelled",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Cancelled" },
];

export default function StudentLessonsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data: lessons = [], isLoading } = useQuery<Lesson[], Error>({
    queryKey: ["lessons", "all"],
    queryFn: getLessons,
    staleTime: 60_000,
  });

  const now = dayjs();

  const upcoming = lessons.filter(
    (s) => s.status === "scheduled" && dayjs(s.scheduled_at).isAfter(now),
  );
  const completed = lessons.filter(
    (s) => s.status === "completed" || s.status === "done",
  );
  const totalMinutes = completed.reduce(
    (sum, s) => sum + s.duration_in_minutes,
    0,
  );
  const totalHours = Math.round(totalMinutes / 60);

  // Next upcoming label
  const nextLesson = [...upcoming].sort((a, b) =>
    dayjs(a.scheduled_at).diff(dayjs(b.scheduled_at)),
  )[0];
  const nextLabel = nextLesson
    ? `Next in ${dayjs(nextLesson.scheduled_at).fromNow(true)}`
    : "None scheduled";

  // Filter + split into upcoming / past
  const filtered = lessons.filter((s) => {
    if (filter === "all") return true;
    if (filter === "scheduled") return s.status === "scheduled";
    if (filter === "completed")
      return s.status === "completed" || s.status === "done";
    if (filter === "canceled") return s.status === "canceled";
    return true;
  });

  const upcomingFiltered = filtered
    .filter(
      (s) => s.status === "scheduled" && dayjs(s.scheduled_at).isAfter(now),
    )
    .sort((a, b) => dayjs(a.scheduled_at).diff(dayjs(b.scheduled_at)));

  const pastFiltered = filtered
    .filter(
      (s) => s.status !== "scheduled" || dayjs(s.scheduled_at).isBefore(now),
    )
    .sort((a, b) => dayjs(b.scheduled_at).diff(dayjs(a.scheduled_at)));

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Lessons</h1>
      </div>

      <div className="space-y-6 p-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Total lessons</p>
            <p className="text-2xl font-semibold text-gray-800">
              {lessons.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Upcoming</p>
            <p className="text-2xl font-semibold text-gray-800">
              {upcoming.length}
            </p>
            <p className="mt-1 text-xs text-emerald-600">{nextLabel}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs text-gray-400">Total hours</p>
            <p className="text-2xl font-semibold text-gray-800">
              {totalHours}h
            </p>
            <p className="mt-1 text-xs text-gray-400">Completed</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                filter === f.key
                  ? "border-emerald-500 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-gray-400">Loading lessons…</p>}

        {/* Upcoming */}
        {upcomingFiltered.length > 0 && (
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Upcoming
            </p>
            <div className="space-y-3">
              {upcomingFiltered.map((s) => (
                <LessonCard key={s.id} lesson={s} />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {pastFiltered.length > 0 && (
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Past lessons
            </p>
            <div className="space-y-3">
              {pastFiltered.map((s) => (
                <LessonCard key={s.id} lesson={s} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="text-sm text-gray-400">No lessons found.</p>
        )}
      </div>
    </div>
  );
}

function LessonCard({ lesson: s }: { lesson: Lesson }) {
  const dt = dayjs(s.scheduled_at);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
      {/* Date block */}
      <div className="min-w-[40px] pt-0.5 text-center">
        <p className="text-xl leading-none font-semibold text-gray-800">
          {dt.format("D")}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400 uppercase">
          {dt.format("MMM")}
        </p>
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-sm font-medium text-gray-800">{s.topic}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineClock className="h-3.5 w-3.5" />
            {dt.format("h:mm A")} · {s.duration_in_minutes} min
          </span>
          {(s.status === "completed" || s.status === "done") && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <HiOutlineVideoCamera className="h-3.5 w-3.5" />
              Recording available
            </span>
          )}
        </div>

        {/* Teacher notes */}
        {s.note && (
          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-500">
            {s.note}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_BADGE[s.status]}`}
        >
          {STATUS_LABEL[s.status]}
        </span>
        {(s.status === "completed" || s.status === "done") && (
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <HiOutlineVideoCamera className="h-3.5 w-3.5" />
            Watch
          </button>
        )}
      </div>
    </div>
  );
}
