import { Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import StyledNavLink from "../ui/NavLink";
import { useAlert } from "../contexts/AlertContext";
import SubscriptionBanner from "../features/public/components/SubscriptionBanner";

export default function SidebarLayout() {
  const { logoutUser, user } = useAuth();
  const alert = useAlert();

  const isAdmin = user?.role === "admin";
  const isInstructor = user?.role === "instructor";
  const isBillingOwner = user?.tenant.is_billing_owner;
  const showBanner = user?.tenant.status !== "active";

  function handleLogout() {
    logoutUser();
    alert.success("Logged out successfully");
  }

  return (
    <>
      {showBanner && isBillingOwner && (
        <SubscriptionBanner
          isBillingOwner={isBillingOwner}
          hasStripeSubscription={user?.tenant.has_stripe_subscription}
          status={user?.tenant.status}
        />
      )}
      <div
        className={`bg-theme-grey-10 flex min-h-screen ${showBanner ? "pt-14" : ""}`}
      >
        <aside className="bg-theme-purple-10 sticky top-0 h-screen w-64">
          <div className="p-6">
            <h1 className="text-2xl font-bold">EduApp</h1>
          </div>

          <nav className="relative flex h-[calc(100vh-72px)] flex-col px-4 py-4">
            <div>
              {isAdmin || isInstructor ? (
                <>
                  <StyledNavLink to="/admin/dashboard">Dashboard</StyledNavLink>
                  <StyledNavLink to="/admin/courses">Courses</StyledNavLink>
                  <StyledNavLink to="/admin/users">Users</StyledNavLink>
                </>
              ) : (
                <>
                  <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
                  <StyledNavLink to="/admin/courses">Courses</StyledNavLink>
                </>
              )}
              <StyledNavLink to="/profile">Profile</StyledNavLink>
            </div>

            <div className="absolute bottom-15 left-0 flex w-full justify-center">
              <button
                onClick={handleLogout}
                className="hover:bg-theme-purple-20/80 rounded border-2 border-gray-600 px-10 py-2 text-sm text-gray-600 hover:text-white"
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
    </>
  );
}
