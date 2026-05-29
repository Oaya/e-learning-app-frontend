import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="border-t py-4 text-center text-sm text-gray-500">
      © EduApp
      <Link to="/refund-policy" className="rounded px-4 py-2 pl-10">
        Refund policy
      </Link>
    </footer>
  );
}
