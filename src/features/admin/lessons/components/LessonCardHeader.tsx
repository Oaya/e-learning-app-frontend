type LessonCardHeaderProps = {
  type: string;
};

export default function LessonCardHeader({ type }: LessonCardHeaderProps) {
  return (
    <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
      {type}
    </p>
  );
}
