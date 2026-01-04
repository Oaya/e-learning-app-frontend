import { Outlet } from "react-router-dom";
import AdminNavLink from "../components/admin/AdminNavLink";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-c-purple w-64">
        <div className="px-6 py-4">
          <h1 className="text-lg font-semibold">LearningApp</h1>
        </div>

        <nav className="space-y-1 px-4 py-4">
          <AdminNavLink to="/admin">Dashboard</AdminNavLink>
          <AdminNavLink to="/admin/courses">Courses</AdminNavLink>
          <AdminNavLink to="/admin/users">Users</AdminNavLink>
          <AdminNavLink to="/admin/settings">Settings</AdminNavLink>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-end px-6">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
