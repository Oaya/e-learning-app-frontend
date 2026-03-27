import { Route } from "react-router-dom";

import HomePage from "../features/public/pages/HomePage";
import PricingPage from "../features/public/pages/PricingPage";
import AcceptInvitePage from "../features/public/pages/AcceptInvitePage";
import EmailConfirmPage from "../features/public/pages/EmailConfirmPage";
import LoginPage from "../features/public/pages/LoginPage";
import PaymentPage from "../features/public/pages/PaymentPage";
import SignupPage from "../features/public/pages/SignupPage";
import ProfilePage from "../features/shared/pages/ProfilePage";
import PlainLayout from "../layouts/PlainLayout";
import PublicLayout from "../layouts/PublicLayout";
import SidebarLayout from "../layouts/SidebarLayout";

export default function PublicRoutes() {
  return (
    <>
      {/* Public Routes with Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/pricing" element={<PricingPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Route>

      {/* Without Header & Footer */}
      <Route element={<PlainLayout />}>
        <Route path="confirm-email" element={<EmailConfirmPage />}></Route>
        <Route path="accept-invite" element={<AcceptInvitePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* Profile Route with Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </>
  );
}
