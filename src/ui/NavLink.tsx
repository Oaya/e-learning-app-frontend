import { NavLink, type NavLinkProps } from "react-router-dom";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";

interface StyledNavLinkProps extends Omit<NavLinkProps, "children"> {
  icon: IconType;
  children: ReactNode;
}

export default function StyledNavLink({
  to,
  children,
  icon: Icon,
  onClick,
}: StyledNavLinkProps) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex w-full items-center gap-3 px-6 py-2 text-xs font-medium transition-transform hover:scale-110 md:px-8 lg:px-12",
          isActive ? "bg-theme-purple-50 text-white" : "text-gray-600",
        ].join(" ")
      }
    >
      <Icon size={20} />
      <span className="text-[16px]">{children}</span>
    </NavLink>
  );
}
