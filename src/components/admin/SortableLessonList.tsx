import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BiDotsVerticalRounded } from "react-icons/bi";

import LessonCard from "./LessonCard";
import type { Lesson } from "../../type/lesson";

type Props = {
  lessons: Lesson[];
  courseId: string;
  disabled?: boolean;
  onReorder: (lessons: Lesson[]) => void;
};

function SortableLessonRow({
  lesson,
  courseId,
  disabled,
}: {
  lesson: Lesson;
  courseId: string;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-60" : ""}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className="flex items-center rounded border border-gray-100 bg-white px-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          title="Drag to reorder"
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <BiDotsVerticalRounded size={18} />
        </button>

        <div className="flex-1">
          <LessonCard lesson={lesson} courseId={courseId} />
        </div>
      </div>
    </div>
  );
}

export default function SortableLessonList({
  lessons,
  courseId,
  disabled,
  onReorder,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function withUpdatedPositions(lessons: Lesson[]) {
    // If your DB uses 0-based, change index + 1 to index
    return lessons.map((l, index) => ({
      ...l,
      position: index + 1,
    }));
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(lessons, oldIndex, newIndex);
    onReorder(withUpdatedPositions(moved));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={lessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <SortableLessonRow
              key={lesson.id}
              lesson={lesson}
              courseId={courseId}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
