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
          "flex w-full flex-col items-center gap-1 rounded px-4 py-2 text-xs font-medium transition-transform hover:scale-110",
          isActive ? "text-white" : "text-gray-600",
        ].join(" ")
      }
    >
      <Icon size={20} />
      <span className="text-[10px]">{children}</span>
    </NavLink>
  );
}
