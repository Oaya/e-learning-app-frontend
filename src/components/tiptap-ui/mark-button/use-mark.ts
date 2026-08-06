"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"
import { useHotkeys } from "react-hotkeys-hook"
import { LuBold, LuCode, LuItalic, LuStrikethrough, LuUnderline } from "react-icons/lu"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "@/lib/tiptap-utils"

export const MARKS = ["bold", "italic", "strike", "code", "underline"] as const
export type Mark = (typeof MARKS)[number]

export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
  bold: "mod+b",
  italic: "mod+i",
  strike: "mod+shift+s",
  code: "mod+e",
  underline: "mod+u",
}

const MARK_ICONS: Record<Mark, React.ComponentType<{ className?: string }>> = {
  bold: LuBold,
  italic: LuItalic,
  strike: LuStrikethrough,
  code: LuCode,
  underline: LuUnderline,
}

const MARK_LABELS: Record<Mark, string> = {
  bold: "Bold",
  italic: "Italic",
  strike: "Strikethrough",
  code: "Code",
  underline: "Underline",
}

/**
 * Configuration for the mark functionality
 */
export interface UseMarkConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The type of mark to toggle.
   */
  type: Mark
  /**
   * Optional label to display alongside the icon.
   */
  label?: string
  /**
   * Whether the button should hide when the mark is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Called when the mark is toggled.
   */
  onToggled?: () => void
}

/**
 * Checks if a mark can be toggled based on the current editor state
 */
export function canToggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ["image"]))
    return false

  return editor.can().toggleMark(type)
}

/**
 * Checks if a mark is currently active
 */
export function isMarkActive(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive(type)
}

/**
 * Determines if the mark button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  type: Mark
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, type, hideWhenUnavailable } = props

  if (!editor) return false

  if (!hideWhenUnavailable) {
    return true
  }

  if (!editor.isEditable) return false
  if (!isMarkInSchema(type, editor)) return false

  if (!editor.isActive("code")) {
    return canToggleMark(editor, type)
  }

  return true
}

export function useMark(config: UseMarkConfig) {
  const {
    editor: providedEditor,
    type,
    label,
    hideWhenUnavailable = false,
    onToggled,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const isMobile = useIsBreakpoint()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canToggle = canToggleMark(editor, type)
  const isActive = isMarkActive(editor, type)
  const shortcutKeys = MARK_SHORTCUT_KEYS[type]

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, type, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, type, hideWhenUnavailable])

  const handleMark = useCallback(() => {
    if (!editor || !canToggle) return false

    const success = editor.chain().focus().toggleMark(type).run()
    if (success) {
      onToggled?.()
    }
    return success
  }, [canToggle, editor, type, onToggled])

  useHotkeys(
    shortcutKeys,
    (event) => {
      event.preventDefault()
      handleMark()
    },
    {
      enabled: isVisible && canToggle,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    isActive,
    handleMark,
    canToggle,
    label: label || MARK_LABELS[type],
    shortcutKeys,
    Icon: MARK_ICONS[type],
  }
}
