type Props = {
  html: string;
};

export default function LessonNotesViewer({ html }: Props) {
  return (
    <div
      className="prose prose-sm max-w-none flex-1 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
