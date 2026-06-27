import type { Lesson } from "../../../../type/lesson";
import LessonCard from "./LessonCard";

type LessonListProps = {
  type: string;
  lessons: Lesson[];
  allLessons?: Lesson[];
  timezone?: string;
};

export default function LessonList({
  type,
  lessons,
  allLessons,
  timezone,
}: LessonListProps) {
  return (
    <section>
      <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
        {type}
      </p>
      <div className="space-y-2">
        {lessons.map((s) => (
          <LessonCard
            key={s.id}
            lesson={s}
            allLessons={allLessons}
            timezone={timezone}
          />
        ))}
      </div>
    </section>
  );
}
