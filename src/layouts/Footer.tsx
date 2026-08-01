import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-theme-gray-10 border-t border-t-gray-300 py-4 text-center text-sm text-gray-500">
      © Fluently
      <Link to="/refund-policy" className="rounded px-4 py-2 pl-10">
        Refund policy
      </Link>
    </footer>
  );
}
