import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-theme-purple-30 fixed start-0 top-0 left-0 z-20 w-full">
      <div className="mx-auto flex flex-wrap items-center justify-between px-20 py-4">
        <div className="flex items-center space-x-8">
          <NavLink to="/" className="text-xl font-semibold">
            fluently
          </NavLink>

          <Link to="/#features" className="font-medium">
            Features
          </Link>
          <Link to="/#how" className="font-medium">
            How it work
          </Link>
          <Link to="/#pricing" className="font-medium">
            Pricing
          </Link>
        </div>

        <div className="flex space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/signup">Get started</Link>
        </div>
      </div>
    </nav>
  );
}
