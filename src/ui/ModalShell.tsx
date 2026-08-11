import { HiOutlineX } from "react-icons/hi";
import type { ReactNode } from "react";

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  headerExtra?: ReactNode;
  maxWidth?: string;
  children: ReactNode;
};

export default function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  headerExtra,
  maxWidth = "max-w-lg",
  children,
}: ModalShellProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay p-4">
      <div className={`w-full ${maxWidth} rounded-2xl bg-white shadow-xl`}>
        <div className="modal-header">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button type="button" onClick={onClose} className="icon-btn">
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
