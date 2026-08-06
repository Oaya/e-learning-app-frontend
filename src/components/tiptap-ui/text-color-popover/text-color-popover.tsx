import { forwardRef, useMemo, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useMenuNavigation } from "@/hooks/use-menu-navigation";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover";
import { Separator } from "@/components/tiptap-ui-primitive/separator";
import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/components/tiptap-ui-primitive/card";

// --- Tiptap UI ---
import type {
  TextColor,
  UseTextColorConfig,
} from "@/components/tiptap-ui/text-color-button";
import {
  TEXT_COLORS,
  TextColorButton,
  useTextColor,
} from "@/components/tiptap-ui/text-color-button";
import { ButtonGroup } from "@/components/tiptap-ui-primitive/button-group";
import { LuBan } from "react-icons/lu";

export interface TextColorPopoverContentProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Optional colors to use in the text color popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: TextColor[];
}

export interface TextColorPopoverProps
  extends
    Omit<ButtonProps, "type">,
    Pick<UseTextColorConfig, "editor" | "hideWhenUnavailable" | "onApplied"> {
  /**
   * Optional colors to use in the text color popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: TextColor[];
}

export const TextColorPopoverButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => (
  <Button
    type="button"
    className={className}
    variant="ghost"
    data-appearance="default"
    role="button"
    tabIndex={-1}
    aria-label="Text color"
    tooltip="Text color"
    ref={ref}
    {...props}
  >
    {children ?? <span className="text-xs font-bold">A</span>}
  </Button>
));

TextColorPopoverButton.displayName = "TextColorPopoverButton";

export function TextColorPopoverContent({
  editor,
  colors = TEXT_COLORS,
}: TextColorPopoverContentProps) {
  const { handleRemoveTextColor } = useTextColor({ editor });
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [...colors, { label: "Remove color", value: "none" }],
    [colors],
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: "both",
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]',
      ) as HTMLElement;
      if (highlightedElement) highlightedElement.click();
      if (item.value === "none") handleRemoveTextColor();
      return true;
    },
    autoSelectFirstItem: false,
  });

  return (
    <Card
      ref={containerRef}
      tabIndex={0}
      style={isMobile ? { boxShadow: "none", border: 0 } : {}}
    >
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup orientation="horizontal">
          <ButtonGroup>
            {colors.map((color, index) => (
              <ButtonGroup key={color.value}>
                <TextColorButton
                  editor={editor}
                  textColor={color.value}
                  tooltip={color.label}
                  aria-label={`${color.label} text color`}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  data-highlighted={selectedIndex === index}
                />
              </ButtonGroup>
            ))}
          </ButtonGroup>
          <Separator />
          <ButtonGroup>
            <Button
              onClick={handleRemoveTextColor}
              aria-label="Remove text color"
              tooltip="Remove text color"
              tabIndex={selectedIndex === colors.length ? 0 : -1}
              type="button"
              role="menuitem"
              variant="ghost"
              data-highlighted={selectedIndex === colors.length}
            >
              <LuBan className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
}

export function TextColorPopover({
  editor: providedEditor,
  colors = TEXT_COLORS,
  hideWhenUnavailable = false,
  onApplied,
  ...props
}: TextColorPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, canSetTextColor, isActive, label } = useTextColor({
    editor,
    hideWhenUnavailable,
    onApplied,
  });

  if (!isVisible) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <TextColorPopoverButton
          disabled={!canSetTextColor}
          data-active-state={isActive ? "on" : "off"}
          data-disabled={!canSetTextColor}
          aria-pressed={isActive}
          aria-label={label}
          tooltip={label}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        avoidCollisions={false}
        aria-label="Text colors"
      >
        <TextColorPopoverContent editor={editor} colors={colors} />
      </PopoverContent>
    </Popover>
  );
}

export default TextColorPopover;
