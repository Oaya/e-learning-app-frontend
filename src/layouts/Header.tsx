import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-theme-purple-30 fixed start-0 top-0 left-0 z-20 w-full">
      <div className="mx-auto flex flex-wrap items-center justify-between px-6 py-4 md:px-20">
        <div className="flex w-full items-center justify-between md:w-auto md:space-x-8">
          <NavLink to="/" className="text-xl font-bold md:text-2xl">
            Fluently
          </NavLink>

          <div className="hidden items-center space-x-8 md:flex">
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

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-2xl md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>

        <div className="hidden space-x-4 md:flex">
          <Link to="/login" className="hover:text-gray-600">
            Login
          </Link>
          <Link to="/signup" className="hover:text-gray-600">
            Get started
          </Link>
        </div>

        {isMenuOpen && (
          <div className="mt-4 flex w-full flex-col space-y-4 md:hidden">
            <Link
              to="/#features"
              className="font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#how"
              className="font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How it work
            </Link>
            <Link
              to="/#pricing"
              className="font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <hr className="border-theme-purple-50" />
            <Link
              to="/login"
              className="hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
