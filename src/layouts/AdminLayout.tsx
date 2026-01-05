import { Outlet, useNavigate } from "react-router-dom";
import AdminNavLink from "../components/admin/AdminNavLink";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }
  return (
    <div className="bg-bg-grey flex min-h-screen">
      <aside className="bg-c-purple w-64">
        <div className="p-6">
          <h1 className="text-2xl font-bold">EduApp</h1>
        </div>

        <nav className="flex h-[calc(100vh-72px)] flex-col space-y-1 px-4 py-4">
          <div>
            <AdminNavLink to="/admin">Dashboard</AdminNavLink>
            <AdminNavLink to="/admin/courses">Courses</AdminNavLink>
            <AdminNavLink to="/admin/users">Users</AdminNavLink>
            <AdminNavLink to="/admin/settings">Settings</AdminNavLink>
          </div>
          <div className="flex-1" />

          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="hover:bg-dark-purple/80 rounded border-2 border-gray-600 px-10 py-2 text-sm text-gray-600 hover:text-white"
            >
              Log out
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col p-4">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
