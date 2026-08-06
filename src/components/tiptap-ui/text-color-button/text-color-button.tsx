import { forwardRef, useCallback, useMemo } from "react"

// --- Tiptap UI ---
import type { UseTextColorConfig } from "@/components/tiptap-ui/text-color-button"
import { useTextColor } from "@/components/tiptap-ui/text-color-button"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Styles ---
import "@/components/tiptap-ui/text-color-button/text-color-button.scss"

export interface TextColorButtonProps
  extends Omit<ButtonProps, "type">, UseTextColorConfig {
  /**
   * Optional text to display alongside the swatch.
   */
  text?: string
}

/**
 * Button component for applying text colors in a Tiptap editor.
 *
 * For custom button implementations, use the `useTextColor` hook instead.
 *
 * @example
 * ```tsx
 * <TextColorButton textColor="#dc2626" />
 * ```
 */
export const TextColorButton = forwardRef<
  HTMLButtonElement,
  TextColorButtonProps
>(
  (
    {
      editor: providedEditor,
      textColor,
      text,
      hideWhenUnavailable = false,
      onApplied,
      onClick,
      children,
      style,
      ...buttonProps
    },
    ref
  ) => {
    const { isVisible, canSetTextColor, isActive, handleSetTextColor, label } =
      useTextColor({
        editor: providedEditor,
        textColor,
        label: text || `Text color (${textColor})`,
        hideWhenUnavailable,
        onApplied,
      })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleSetTextColor()
      },
      [handleSetTextColor, onClick]
    )

    const buttonStyle = useMemo(
      () =>
        ({
          ...style,
          "--text-color": textColor,
        }) as React.CSSProperties,
      [textColor, style]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canSetTextColor}
        data-disabled={!canSetTextColor}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        style={buttonStyle}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span
              className="tiptap-button-text-color"
              style={
                { "--text-color": textColor } as React.CSSProperties
              }
            />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

TextColorButton.displayName = "TextColorButton"
