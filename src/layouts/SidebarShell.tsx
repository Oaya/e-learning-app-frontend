import { useRef, useState, useEffect, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HiArrowRightOnRectangle, HiBars3, HiXMark } from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import defaultAvatar from "@/assets/user.png";

interface Props {
  children: ReactNode;
  banner?: ReactNode;
}

export default function SidebarShell({ children, banner }: Props) {
  const { logoutUser, user } = useAuth();
  const alert = useAlert();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    alert.success("Logged out successfully");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-theme-gray-10 flex h-screen flex-col md:flex-row">
      <div className="bg-theme-purple-10 flex items-center justify-between px-4 py-3 md:hidden">
        <h1 className="text-2xl font-bold" onClick={() => navigate("/")}>
          Fluently
        </h1>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="text-2xl"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "bg-theme-purple-10 fixed inset-y-0 left-0 z-30 flex h-screen flex-col transition-transform duration-200 md:sticky md:top-0 md:w-60 md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-10 pt-6">
          <h1 className="text-2xl font-bold">Fluently</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-10 overflow-y-auto py-4 pt-8">
          {children}

          <div className="mt-auto border-t border-gray-400">
            {user && (
              <div className="relative px-6 pt-6" ref={dropdownRef}>
                <button
                  className="flex w-full items-center gap-3 rounded-md p-1 transition hover:bg-white/10"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0 text-left">
                    <div className="truncate text-base font-medium text-white">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-6 bottom-full left-6 mb-2 overflow-hidden rounded-md border border-white/20 bg-white shadow-lg">
                    <button
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <HiArrowRightOnRectangle size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {banner}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
