import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="flex justify-between border-t px-10 py-4 text-center text-sm text-gray-500">
      <div>JobDesk</div>
      <div>
        <Link to="/refund-policy" className="rounded px-4 py-2 pl-10">
          Privacy
        </Link>
        <Link to="/refund-policy" className="rounded px-4 py-2 pl-10">
          Refund policy
        </Link>
        <Link to="/refund-policy" className="rounded px-4 py-2 pl-10">
          contact
        </Link>
      </div>
      <div> © JobDesk</div>
    </footer>
  );
}
