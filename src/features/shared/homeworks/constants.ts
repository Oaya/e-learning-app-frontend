import type { Homework } from "../../../type/homework";

export type HomeworkFilterTab =
  | "all"
  | "pending"
  | "submitted"
  | "overdue"
  | "reviewed";

export function matchesTab(h: Homework, tab: HomeworkFilterTab) {
  if (tab === "all") return true;
  if (tab === "pending") return h.status === "draft" || h.status === "pending";
  return h.status === tab;
}

export function inGroup(h: Homework, group: Exclude<HomeworkFilterTab, "all">) {
  if (group === "pending")
    return h.status === "draft" || h.status === "pending";
  return h.status === group;
}
