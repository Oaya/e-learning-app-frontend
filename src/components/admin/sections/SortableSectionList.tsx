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

import type { SectionWithLessons } from "../../../type/section";
import SectionCard from "./SectionCard";

type Props = {
  sections: SectionWithLessons[];
  courseId: string;
  disabled?: boolean;
  openAddSection: boolean;
  setAddSectionOpen: (v: boolean) => void;
  onReorder: (sections: SectionWithLessons[]) => void;
};

function SortableSectionRow({
  index,
  section,
  courseId,
  disabled,
  openAddSection,
  setAddSectionOpen,
}: {
  index: number;
  section: SectionWithLessons;
  courseId: string;
  disabled?: boolean;
  openAddSection: boolean;
  setAddSectionOpen: (v: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled });

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

        <div className="w-full space-y-4">
          <SectionCard
            index={index}
            section={section}
            courseId={courseId}
            openAddSection={openAddSection}
            setAddSectionOpen={setAddSectionOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default function SortableSectionList({
  sections,
  courseId,
  disabled,
  openAddSection,
  setAddSectionOpen,
  onReorder,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function withUpdatedPositions(sections: SectionWithLessons[]) {
    // If your DB uses 0-based, change index + 1 to index
    return sections.map((s, index) => ({
      ...s,
      position: index + 1,
    }));
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(sections, oldIndex, newIndex);
    onReorder(withUpdatedPositions(moved));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section, index) => (
            <SortableSectionRow
              index={index}
              key={section.id}
              section={section}
              courseId={courseId}
              disabled={disabled}
              openAddSection={openAddSection}
              setAddSectionOpen={setAddSectionOpen}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
