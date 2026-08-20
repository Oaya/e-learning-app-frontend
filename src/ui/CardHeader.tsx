type LessonCardHeaderProps = {
  type: string;
};

export default function CardHeader({ type }: LessonCardHeaderProps) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold tracking-widest text-gray-400 uppercase md:mb-3">
      {type}
    </p>
  );
}
