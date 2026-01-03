import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky start-0 top-0 z-20 w-full">
      <div className="mx-auto flex flex-wrap items-center justify-between px-20 py-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <NavLink to="/">
            <span className="text-heading text-c-gray self-center text-xl font-semibold whitespace-nowrap">
              LearningApp
            </span>
          </NavLink>

          <NavLink to="/pricing">
            <span className="self-center whitespace-nowrap">Pricing</span>
          </NavLink>
        </div>

        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <NavLink to="/login">
            <span className="mr-4 whitespace-nowrap">Login</span>
          </NavLink>
          <NavLink to="/signup">
            <span className="whitespace-nowrap">Sign up</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
