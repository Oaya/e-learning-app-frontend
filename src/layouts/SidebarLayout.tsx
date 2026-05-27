import { Outlet } from "react-router-dom";
import {
  HiHome,
  HiAcademicCap,
  HiUsers,
  HiUser,
  HiLogout,
} from "react-icons/hi";

import { useAuth } from "../contexts/AuthContext";
import StyledNavLink from "../ui/NavLink";
import { useAlert } from "../contexts/AlertContext";
import SubscriptionBanner from "../features/public/components/SubscriptionBanner";
import { UserModel } from "../models/user";

export default function SidebarLayout() {
  const { logoutUser, user } = useAuth();
  const alert = useAlert();

  const userData = new UserModel(user);

  const isStudent = userData.isStudent();
  const isBillingOwner = userData.isBillingOwner();

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
          hasStripeSubscription={user?.tenant.has_stripe_subscription ?? false}
          status={user?.tenant.status ?? ""}
        />
      )}
      <div
        className={`bg-theme-grey-10 flex h-screen ${showBanner ? "pt-14" : ""}`}
      >
        <aside className="bg-theme-purple-10 sticky top-0 h-screen w-20">
          {/* <div className="p-6">
            <h1 className="text-2xl font-bold">EduApp</h1>
          </div> */}

          <nav className="flex h-full flex-col px-4 py-4">
            <div>
              {!isStudent ? (
                <>
                  <StyledNavLink to="/admin/dashboard" icon={HiHome}>
                    Dashboard
                  </StyledNavLink>
                  <StyledNavLink to="/admin/courses" icon={HiAcademicCap}>
                    Courses
                  </StyledNavLink>
                  <StyledNavLink to="/admin/users" icon={HiUsers}>
                    Users
                  </StyledNavLink>
                </>
              ) : (
                <>
                  <StyledNavLink to="/dashboard" icon={HiHome}>
                    Dashboard
                  </StyledNavLink>
                  <StyledNavLink to="/student/courses" icon={HiAcademicCap}>
                    Courses
                  </StyledNavLink>
                </>
              )}
            </div>

            <div className="mt-auto">
              <StyledNavLink to="/profile" icon={HiUser}>
                Profile
              </StyledNavLink>
              <StyledNavLink to="/" icon={HiLogout} onClick={handleLogout}>
                Logout
              </StyledNavLink>
            </div>
          </nav>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
