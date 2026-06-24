import { useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { HiHome, HiUsers } from "react-icons/hi";
import { LuNewspaper, LuGoal, LuCalendar1, LuVideo } from "react-icons/lu";
import { MdPayment } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

import { useAuth } from "../contexts/AuthContext";
import StyledNavLink from "../ui/NavLink";
import { useAlert } from "../contexts/AlertContext";
import SubscriptionBanner from "../features/public/components/SubscriptionBanner";

export default function AdminSidebarLayout() {
  const { logoutUser, user } = useAuth();
  const alert = useAlert();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showBanner = user?.status !== "active";

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

  return (
    <>
      <div className="bg-theme-gray-10 flex h-screen">
        <aside className="bg-theme-purple-10 sticky top-0 flex h-screen w-60 flex-col">
          <div className="px-10 pt-6">
            <h1 className="text-2xl font-bold">fluently</h1>
          </div>

          <nav className="flex flex-1 flex-col gap-10 overflow-y-auto py-4 pt-8">
            <section className="text-sm font-semibold text-gray-600">
              <h2 className="px-10">MAIN</h2>
              <StyledNavLink to="/admin/dashboard" icon={HiHome}>
                Dashboard
              </StyledNavLink>

              <StyledNavLink to="/admin/students" icon={HiUsers}>
                Students
              </StyledNavLink>
              <StyledNavLink to="/admin/sessions" icon={LuCalendar1}>
                Sessions
              </StyledNavLink>
            </section>

            <section className="text-sm font-semibold text-gray-600">
              <h2 className="px-10">TEACHING</h2>
              <StyledNavLink to="/admin/homework" icon={LuNewspaper}>
                Homework
              </StyledNavLink>
              <StyledNavLink to="/admin/goals" icon={LuGoal}>
                Goal
              </StyledNavLink>
              <StyledNavLink to="/admin/recording" icon={LuVideo}>
                Recordings
              </StyledNavLink>
            </section>

            <section className="text-sm font-semibold text-gray-600">
              <h2 className="px-10">ADMIN</h2>
              <StyledNavLink to="/admin/payment" icon={MdPayment}>
                Payment
              </StyledNavLink>
              <StyledNavLink to="/profile" icon={IoMdSettings}>
                Profile
              </StyledNavLink>
            </section>

            <div className="mt-auto border-t border-gray-400">
              {user && (
                <div className="relative px-6 pt-6" ref={dropdownRef}>
                  <button
                    className="flex w-full items-center gap-3 rounded-md p-1 transition hover:bg-white/10"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/30 text-sm font-semibold text-white">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </div>
                    )}
                    <div className="min-w-0 text-left">
                      <div className="truncate text-base font-medium text-white">
                        {`${user.first_name} ${user.last_name}`}
                      </div>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-6 bottom-full left-6 mb-2 overflow-hidden rounded-md border border-white/20 bg-white shadow-lg">
                      <button
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <HiArrowRightOnRectangle className="h-4 w-4" />
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
          {showBanner && (
            <SubscriptionBanner
              hasStripeSubscription={
                user?.subscription?.has_stripe_subscription ?? false
              }
              status={user?.status ?? ""}
            />
          )}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
