import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky start-0 top-0 z-20 w-full">
      <div className="mx-auto flex flex-wrap items-center justify-between px-20 py-4">
        <div className="flex items-center space-x-8">
          <NavLink to="/" className="text-xl font-semibold">
            EduApp
          </NavLink>

          <NavLink to="/pricing" className="font-medium">
            Pricing
          </NavLink>

          <NavLink to="/courses" className="font-medium">
            Browse courses
          </NavLink>
        </div>

        <div className="flex space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}
