import { NavLink, type NavLinkProps } from "react-router-dom";

export default function StyledNavLink({ to, children }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "block rounded px-3 py-2 text-sm font-medium",
          isActive
            ? "text-dark-purple bg-gray-200"
            : "text-gray-600 hover:bg-gray-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
