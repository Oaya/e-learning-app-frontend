import dayjs from "dayjs";
import { useMemo } from "react";

export function useUpcomingPastSplit<T extends { scheduled_at: string }>(
  lessons: T[] | undefined,
) {
  return useMemo(() => {
    const now = dayjs();
    return {
      upcoming: lessons?.filter((l) => dayjs(l.scheduled_at).isAfter(now)),
      past: lessons?.filter((l) => dayjs(l.scheduled_at).isBefore(now)),
    };
  }, [lessons]);
}
