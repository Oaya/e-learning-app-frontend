"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "@/lib/tiptap-utils"

export const TEXT_COLORS = [
  { label: "Black", value: "#1f2937" },
  { label: "Gray", value: "#6b7280" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#16a34a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#9333ea" },
]
export type TextColor = (typeof TEXT_COLORS)[number]

/**
 * Configuration for the text color functionality
 */
export interface UseTextColorConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The color to apply when setting the text color.
   */
  textColor?: string
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
   * Called when the text color is applied.
   */
  onApplied?: ({ color, label }: { color: string; label: string }) => void
}

/**
 * Checks if a text color can be applied based on the current editor state
 */
export function canSetTextColor(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isMarkInSchema("textStyle", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  return editor.can().setMark("textStyle")
}

/**
 * Checks if a text color is currently active
 */
export function isTextColorActive(
  editor: Editor | null,
  textColor?: string
): boolean {
  if (!editor || !editor.isEditable) return false

  return textColor
    ? editor.isActive("textStyle", { color: textColor })
    : editor.isActive("textStyle")
}

/**
 * Removes the text color mark
 */
export function removeTextColor(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canSetTextColor(editor)) return false

  return editor.chain().focus().unsetColor().run()
}

/**
 * Determines if the text color button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor) return false

  if (!hideWhenUnavailable) {
    return true
  }

  if (!editor.isEditable) return false
  if (!isMarkInSchema("textStyle", editor)) return false

  if (!editor.isActive("code")) {
    return canSetTextColor(editor)
  }

  return true
}

export function useTextColor(config: UseTextColorConfig) {
  const {
    editor: providedEditor,
    label,
    textColor,
    hideWhenUnavailable = false,
    onApplied,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canSetTextColorState = canSetTextColor(editor)
  const isActive = isTextColorActive(editor, textColor)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleSetTextColor = useCallback(() => {
    if (!editor || !canSetTextColorState || !textColor || !label)
      return false

    const success = editor.chain().focus().setColor(textColor).run()
    if (success) {
      onApplied?.({ color: textColor, label })
    }
    return success
  }, [canSetTextColorState, textColor, editor, label, onApplied])

  const handleRemoveTextColor = useCallback(() => {
    const success = removeTextColor(editor)
    if (success) {
      onApplied?.({ color: "", label: "Remove color" })
    }
    return success
  }, [editor, onApplied])

  return {
    isVisible,
    isActive,
    handleSetTextColor,
    handleRemoveTextColor,
    canSetTextColor: canSetTextColorState,
    label: label || `Text color`,
  }
}
