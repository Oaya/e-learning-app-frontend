import { HiHome, HiUsers } from "react-icons/hi";
import { LuNewspaper, LuCalendar1 } from "react-icons/lu";
// import { MdPayment } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

import { useAuth } from "@/contexts/AuthContext";
import StyledNavLink from "@/ui/NavLink";
import SubscriptionBanner from "@/features/public/components/SubscriptionBanner";
import SidebarShell from "./SidebarShell";

export default function AdminSidebarLayout() {
  const { user } = useAuth();

  const banner =
    user?.subscription?.status !== "active" ? (
      <SubscriptionBanner
        hasStripeSubscription={
          user?.subscription?.has_stripe_subscription ?? false
        }
        status={user?.subscription?.status ?? ""}
      />
    ) : undefined;

  return (
    <SidebarShell banner={banner}>
      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">MAIN</h2>
        <StyledNavLink to="/admin/dashboard" icon={HiHome}>
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/admin/students" icon={HiUsers}>
          Students
        </StyledNavLink>
        <StyledNavLink to="/admin/lessons" icon={LuCalendar1}>
          Lessons
        </StyledNavLink>
        <StyledNavLink to="/admin/homework" icon={LuNewspaper}>
          Homework
        </StyledNavLink>
      </section>

      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">ADMIN</h2>
        {/* <StyledNavLink to="/admin/payment" icon={MdPayment}>
          Payment
        </StyledNavLink> */}
        <StyledNavLink to="/profile" icon={IoMdSettings}>
          Profile
        </StyledNavLink>
      </section>
    </SidebarShell>
  );
}
