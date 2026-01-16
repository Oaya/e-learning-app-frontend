import React, { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

export default function ReadingEditor({ value, onChange, disabled }: Props) {
  const [linkUrl, setLinkUrl] = useState("");
  const [openLink, setOpenLink] = useState(false);

  console.log("Rendering ReadingEditor", value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: value || "<p></p>",
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      // If cursor/selection is inside a link, show its href in the input
      const href = editor.getAttributes("link").href;
      setLinkUrl(href || "");
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] w-full rounded border border-gray-300 bg-white p-3 text-sm focus:outline-none",
      },

      handleKeyDown(_view, event) {
        if (!editor) return false;

        // break out of the link so the next typing isn't linked, if use type space or enter
        if (
          (event.key === " " || event.key === "Enter") &&
          editor.isActive("link")
        ) {
          event.preventDefault();

          if (event.key === " ") {
            editor.chain().focus().insertContent(" ").unsetLink().run();
          } else {
            editor.chain().focus().setHardBreak().unsetLink().run();
          }

          return true;
        }

        return false;
      },
    },
  });

  // Keep editor in sync if parent `value` changes
  useEffect(() => {
    if (!editor) return;
    const next = value || "<p></p>";
    const current = editor.getHTML();

    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false } as any);
    }
  }, [editor, value]);

  const applyLink = () => {
    if (!editor) return;

    const url = linkUrl.trim();

    //If empty, remove link
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkUrl("");
      setOpenLink(false);
      return;
    }
    // Apply link to selection; if cursor is inside an existing link, update it.
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setOpenLink(false);
  };

  const removeLink = () => {
    if (!editor) {
      setOpenLink(false);
      return;
    }

    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkUrl("");
    setOpenLink(false);
  };
  const Btn = ({
    active,
    onClick,
    children,
    disabled: btnDisabled,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || btnDisabled}
      className={`rounded border px-2 py-1 text-xs ${
        active ? "bg-gray-200" : "bg-white"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );

  //Chekc if any tesxt is selected
  const hasSelection = useMemo(() => {
    const { from, to } = editor?.state.selection;
    return from !== to;
  }, [editor.state.selection]);

  if (!editor) return null;

  return (
    <div className="">
      <div className="mt-1 flex flex-wrap gap-2 rounded border border-gray-200 bg-gray-50 p-2">
        <Btn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
        >
          Bold
        </Btn>

        <Btn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
        >
          Italic
        </Btn>

        <Btn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
        >
          Strike
        </Btn>
        <Btn
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </Btn>
        <Btn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Btn>
        <Btn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Btn>
        <Btn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Btn>
        <Btn
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </Btn>
        <Btn active={editor.isActive("link")} onClick={() => setOpenLink(true)}>
          Link
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </Btn>
      </div>

      {openLink && (
        <div className="flex items-center gap-2 rounded border border-gray-200 bg-white p-2">
          <label className="text-xs font-medium text-gray-600">Link URL</label>

          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={
              editor.isActive("link")
                ? "Edit link URL"
                : hasSelection
                  ? "Paste URL to link selected text"
                  : "Select text, then paste URL"
            }
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
            }}
          />

          <button
            type="button"
            onClick={applyLink}
            disabled={disabled}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={removeLink}
            disabled={disabled || (!editor.isActive("link") && !linkUrl)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
