import type { LessonStatusType } from "../../../type/lesson";

export type LessonFilterTab = "all" | LessonStatusType;

export const LESSON_TABS: LessonFilterTab[] = [
  "all",
  "scheduled",
  "completed",
  "canceled",
  "no_show",
];
