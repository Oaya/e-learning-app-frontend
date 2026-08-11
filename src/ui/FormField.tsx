import type { ReactNode } from "react";

type FormFieldProps = {
  label: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export default function FormField({
  label,
  optional,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="sm-label">
        {label}
        {optional && <span className="text-gray-300"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}
