import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";

import type { SectionWithLessons } from "../../type/section";

export default function SectionDetails({
  section,
}: {
  section: SectionWithLessons;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<
    Record<string, boolean>
  >({});

  const toggleOpenSection = (sectionId: string) =>
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  return (
    <div
      key={section.id}
      className="rounded-md border border-gray-200 bg-white"
    >
      {/* Section header */}
      <button
        type="button"
        onClick={() => toggleOpenSection(section.id)}
        className="bg-c-purple/10 flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-gray-600">{section.title}</span>
        <AiOutlineDown fontSize={18} />
      </button>

      {/* Section body */}
      {openSection === section.id && (
        <div className="space-y-3 p-4 text-sm text-gray-600">
          {section.description && (
            <p className="text-gray-500">{section.description}</p>
          )}

          {section.lessons?.map((lesson) => {
            const expanded = !!expandedLessons[lesson.id];
            const desc = lesson.description ?? "";
            const isLong = desc.length > 80;

            return (
              <div
                key={lesson.id}
                className="rounded border border-gray-200 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {lesson.title}
                      </span>

                      <span className="bg-c-light-yellow rounded-full px-2 py-0.5 text-xs font-medium text-white">
                        {lesson.lesson_type}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-xs text-gray-500">
                    {lesson.duration_in_seconds
                      ? `${lesson.duration_in_seconds} seconds`
                      : ""}
                  </div>
                </div>

                {desc && (
                  <div className="mt-2">
                    <p
                      className={`text-sm text-gray-500 ${
                        expanded ? "" : "line-clamp-1"
                      }`}
                    >
                      {desc}
                    </p>

                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggleLesson(lesson.id)}
                        className="text-c-purple mt-1 text-xs font-medium hover:underline"
                      >
                        {expanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
