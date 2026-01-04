import { NavLink, type NavLinkProps } from "react-router-dom";

export default function AdminNavLInk({ to, children }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "block rounded px-3 py-2 text-sm font-medium",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
