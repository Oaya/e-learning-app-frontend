import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { Homework } from "../type/homework";
import type { Lesson } from "../type/lesson";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function capitalize(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

//Time Converter//
export function formatTime(iso: string) {
  return dayjs(iso).format("h:mm A");
}

export function formatDay(iso: string) {
  const d = dayjs(iso);
  return {
    day: d.date(),
    mon: d.format("MMM"),
  };
}

export function getHomeworkDateLabel(hw: Homework) {
  const value =
    hw.status === "reviewed" && hw.submission?.reviewed_at
      ? `Reviewed: ${hw.submission.reviewed_at}`
      : hw.status === "submitted" && hw.submission?.submitted_at
        ? `Submitted: ${hw.submission.submitted_at}`
        : `Due: ${hw.due_date}`;

  return value;
}

export function canJoinLesson(lesson: Lesson) {
  const now = dayjs();

  return (
    lesson.status === "scheduled" &&
    now.isSameOrAfter(dayjs(lesson.scheduled_at).subtract(30, "minute")) &&
    now.isSameOrBefore(
      dayjs(lesson.scheduled_at).add(lesson.duration_in_minutes, "minute"),
    )
  );
}

export function requireStatusChange(lesson: Lesson) {
  const now = dayjs();

  return (
    lesson.status === "scheduled" &&
    now.isAfter(
      dayjs(lesson.scheduled_at).add(lesson.duration_in_minutes, "minute"),
    )
  );
}
