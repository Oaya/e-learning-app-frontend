import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { Homework } from "@/type/homework";
import type { Lesson } from "@/type/lesson";
import type { Invoice } from "@/type/invoice";

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

export function groupInvoicesByMonth(invoices: Invoice[]) {
  const map: Record<
    string,
    { month: string; Earned: number; Outstanding: number }
  > = {};

  const toKey = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("default", { month: "short", year: "numeric" }),
    };
  };

  invoices.forEach((invoice) => {
    if (invoice.status === "paid" && invoice.paid_at) {
      const { key, label } = toKey(invoice.paid_at);
      if (!map[key]) map[key] = { month: label, Earned: 0, Outstanding: 0 };
      map[key].Earned += Number(invoice.amount);
    } else if (invoice.status === "unpaid") {
      const rawDate = invoice.due_date ?? invoice.created_at;
      const { key, label } = toKey(rawDate);
      if (!map[key]) map[key] = { month: label, Earned: 0, Outstanding: 0 };
      map[key].Outstanding += Number(invoice.amount);
    }
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}
