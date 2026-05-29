import { lazy } from "react";
import { Route } from "react-router-dom";

import PlainLayout from "../layouts/PlainLayout";
import PublicLayout from "../layouts/PublicLayout";
import SidebarLayout from "../layouts/SidebarLayout";

const HomePage = lazy(() => import("../features/public/pages/HomePage"));
const PricingPage = lazy(() => import("../features/public/pages/PricingPage"));
const AcceptInvitePage = lazy(() => import("../features/public/pages/AcceptInvitePage"));
const EmailConfirmPage = lazy(() => import("../features/public/pages/EmailConfirmPage"));
const LoginPage = lazy(() => import("../features/public/pages/LoginPage"));
const PaymentPage = lazy(() => import("../features/public/pages/PaymentPage"));
const SignupPage = lazy(() => import("../features/public/pages/SignupPage"));
const MyProfilePage = lazy(() => import("../features/shared/profile/pages/MyProfilePage"));
const UserProfile = lazy(() => import("../features/shared/profile/pages/UserProfilePage"));
const RefundPolicyPage = lazy(() => import("../features/public/pages/RefundPolicyPage"));

export default function PublicRoutes() {
  return (
    <>
      {/* Public Routes with Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/pricing" element={<PricingPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="refund-policy" element={<RefundPolicyPage />}></Route>
      </Route>

      {/* Without Header & Footer */}
      <Route element={<PlainLayout />}>
        <Route path="confirm-email" element={<EmailConfirmPage />}></Route>
        <Route path="accept-invite" element={<AcceptInvitePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* Profile Route with Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Route>
    </>
  );
}
