import StatCard from "./statsCard";

type Props = {
  courses: number;
  hoursThisWeek: number;
  lessonsCompleted: number;
  totalLessons: number;
  streakDays: number;
};

export default function StatsBar({
  courses,
  hoursThisWeek,
  lessonsCompleted,
  totalLessons,
  streakDays,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "28px",
      }}
    >
      <StatCard icon="📚" label="Courses" value={courses} sub="in progress" />
      <StatCard
        icon="⏱️"
        label="Hours this week"
        value={hoursThisWeek}
        sub="keep it up!"
      />
      <StatCard
        icon="✅"
        label="Lessons done"
        value={`${lessonsCompleted}/${totalLessons}`}
      />
      <StatCard
        icon="🔥"
        label="Day streak"
        value={streakDays}
        sub="days in a row"
      />
    </div>
  );
}
