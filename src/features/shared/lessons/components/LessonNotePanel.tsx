import {
  useEffect,
  useRef,
  useCallback,
  type SetStateAction,
  type Dispatch,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TbMinus,
  TbX,
  TbTable,
  TbRowInsertBottom,
  TbColumnInsertRight,
  TbRowRemove,
  TbColumnRemove,
  TbTableMinus,
} from "react-icons/tb";
import type { Room } from "livekit-client";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { TextColorPopover } from "@/components/tiptap-ui/text-color-popover";

import { UpdateMeetingNote } from "../../../../api/lessons";

import { TaskList, TaskItem } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";

import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import NoteToolBarButton from "./NoteToolBarButton";

const TOPIC = "lesson-notes";

interface Props {
  lessonId: string;
  initialContent?: string;
  room?: Room;
  /** teacher = editable + broadcasts; student = read-only */
  readonly?: boolean;
  onClosed: Dispatch<SetStateAction<boolean>>;
}

export default function LessonNotesPanel({
  lessonId,
  initialContent = "",
  room,
  readonly = false,
  onClosed,
}: Props) {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [contents, setContent] = useState(initialContent);

  const saveToBackend = useCallback(
    (html: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        const res = await UpdateMeetingNote(lessonId, {
          meeting_note: html,
        } as any);

        if (res.success && res.data.meeting_note) {
          setContent(res.data.meeting_note);
        }
      }, 1000);
    },
    [lessonId],
  );

  const broadcast = useCallback(
    (html: string) => {
      if (!room?.localParticipant) return;
      const payload = JSON.stringify({ topic: TOPIC, html });
      room.localParticipant.publishData(new TextEncoder().encode(payload), {
        reliable: true,
      });
    },
    [room],
  );

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: readonly ? false : "start",
    extensions: [
      StarterKit,
      TextStyle, // required by Color
      Color, // text color
      Highlight.configure({ multicolor: true }), // background color
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: contents,
    editable: !readonly,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      saveToBackend(html);
      broadcast(html);
    },
  });

  const [inTable, setInTable] = useState(false);

  useEffect(() => {
    if (!room || !readonly || !editor) return;

    const decoder = new TextDecoder();
    const handler = (data: Uint8Array) => {
      try {
        const parsed = JSON.parse(decoder.decode(data));
        if (parsed.topic === TOPIC) {
          // Preserve cursor position
          editor.commands.setContent(parsed.html);
        }
      } catch {
        // ignore malformed packets
      }
    };

    room.on("dataReceived", handler);
    return () => {
      room.off("dataReceived", handler);
    };
  }, [room, readonly, editor]);

  useEffect(() => {
    if (!editor) return;

    const updateInTable = () => setInTable(editor.isActive("table"));
    updateInTable();

    editor.on("selectionUpdate", updateInTable);
    editor.on("transaction", updateInTable);
    return () => {
      editor.off("selectionUpdate", updateInTable);
      editor.off("transaction", updateInTable);
    };
  }, [editor]);

  useEffect(() => {
    if (!room || !readonly || !editor) return;

    const decoder = new TextDecoder();
    const handler = (data: Uint8Array) => {
      try {
        const parsed = JSON.parse(decoder.decode(data));
        if (parsed.topic === TOPIC) {
          // Preserve cursor position
          editor.commands.setContent(parsed.html);
        }
      } catch {
        // ignore malformed packets
      }
    };

    room.on("dataReceived", handler);
    return () => {
      room.off("dataReceived", handler);
    };
  }, [room, readonly, editor]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">Lesson Note</span>
        {!readonly && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Auto-saved</span>
            <div
              className="rounded border border-gray-500 p-1 font-semibold text-gray-500"
              onClick={() => onClosed(false)}
            >
              <TbX size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Toolbar — teacher only */}
      {!readonly && (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-3 py-2">
          <UndoRedoButton editor={editor} action="undo" />
          <UndoRedoButton editor={editor} action="redo" />

          <MarkButton editor={editor} type="bold" />
          <MarkButton editor={editor} type="italic" />
          <HeadingDropdownMenu editor={editor} />
          <MarkButton editor={editor} type="underline" />
          <MarkButton editor={editor} type="strike" />

          <ListDropdownMenu editor={editor ?? undefined} />
          <NoteToolBarButton
            label="Horizontal rule"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <TbMinus size={15} />
          </NoteToolBarButton>

          <TextColorPopover editor={editor} />
          <ColorHighlightPopover editor={editor} />
          <TextAlignButton editor={editor ?? undefined} align="left" />
          <TextAlignButton editor={editor ?? undefined} align="center" />
          <TextAlignButton editor={editor ?? undefined} align="right" />
          <TextAlignButton editor={editor ?? undefined} align="justify" />
          <LinkPopover editor={editor} />

          <NoteToolBarButton
            label="Insert table"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TbTable size={15} />
          </NoteToolBarButton>
          {inTable && (
            <>
              <NoteToolBarButton
                label="Add row after"
                onClick={() => editor?.chain().focus().addRowAfter().run()}
              >
                <TbRowInsertBottom size={15} />
              </NoteToolBarButton>
              <NoteToolBarButton
                label="Add column after"
                onClick={() => editor?.chain().focus().addColumnAfter().run()}
              >
                <TbColumnInsertRight size={15} />
              </NoteToolBarButton>
              <NoteToolBarButton
                label="Delete row"
                onClick={() => editor?.chain().focus().deleteRow().run()}
              >
                <TbRowRemove size={15} />
              </NoteToolBarButton>
              <NoteToolBarButton
                label="Delete column"
                onClick={() => editor?.chain().focus().deleteColumn().run()}
              >
                <TbColumnRemove size={15} />
              </NoteToolBarButton>
              <NoteToolBarButton
                label="Delete table"
                onClick={() => editor?.chain().focus().deleteTable().run()}
              >
                <TbTableMinus size={15} />
              </NoteToolBarButton>
            </>
          )}
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-700 focus:outline-none"
      />
    </div>
  );
}
