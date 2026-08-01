import type { ReactNode } from "react";
import { TbLanguage } from "react-icons/tb";

type Props = {
  children: ReactNode;
  className: string;
};

export default function AuthCard({ children, className }: Props) {
  return (
    <div
      className={`bg-theme-gray-10 flex h-full items-center justify-center ${className}`}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Accent bar */}
        <div className="from-theme-purple-50 to-theme-purple-10 h-1 w-full bg-linear-to-r" />

        <div className="px-8 py-6">
          {/* Logo */}
          <div className="mb-7 flex items-center justify-center gap-2">
            <div className="bg-theme-purple-50 flex h-9 w-9 items-center justify-center rounded-xl">
              <TbLanguage size={20} className="font-bold text-white" />
            </div>
            <span className="text-theme-purple-20 text-lg font-bold tracking-tight">
              Fluently
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
