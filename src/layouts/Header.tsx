import { Link } from "react-router-dom";
import { GiJourney } from "react-icons/gi";

export default function Header() {
  return (
    <header className="bg-theme-purple-30 fixed start-0 top-0 left-0 z-20 flex w-full items-center justify-between px-20">
      <Link to="/" className="align-center flex gap-1">
        <GiJourney size={20} />
        <span className="font-semibold">JobDesk</span>
      </Link>
      <nav className="mx-auto flex flex-wrap items-center justify-between px-20 py-4">
        <div className="flex items-center space-x-8">
          <a href="/#features" className="font-medium">
            Features
          </a>
          <a href="/#how" className="font-medium">
            How it works
          </a>
          <a href="/#pricing" className="font-medium">
            Pricing
          </a>
        </div>
      </nav>
      <div className="flex space-x-4">
        <Link to="/login" className="rounded px-2 py-1 hover:underline">
          Log in
        </Link>
        <Link
          to="/signup"
          className="bg-theme-purple-20 hover:bg-theme-purple-20/60 rounded px-2 py-1 text-white"
        >
          Try for free
        </Link>
      </div>
    </header>
  );
}
