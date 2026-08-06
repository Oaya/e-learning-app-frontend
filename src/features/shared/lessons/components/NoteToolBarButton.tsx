import React from "react";

export default function NoteToolBarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
    >
      {children}
    </button>
  );
}
