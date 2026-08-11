import { lazy } from "react";
import { Route } from "react-router-dom";

import PlainLayout from "@/layouts/PlainLayout";
import PublicLayout from "@/layouts/PublicLayout";

const HomePage = lazy(() => import("@/features/public/pages/HomePage"));
const AcceptInvitePage = lazy(
  () => import("@/features/public/pages/AcceptInvitePage"),
);
const EmailConfirmPage = lazy(
  () => import("@/features/public/pages/EmailConfirmPage"),
);
const LoginPage = lazy(() => import("@/features/public/pages/LoginPage"));
const PaymentPage = lazy(() => import("@/features/public/pages/PaymentPage"));
const SignupPage = lazy(() => import("@/features/public/pages/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/public/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/public/pages/ResetPasswordPage"),
);
const RefundPolicyPage = lazy(
  () => import("@/features/public/pages/RefundPolicyPage"),
);

export default function PublicRoutes() {
  return (
    <>
      {/* Public Routes with Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="refund-policy" element={<RefundPolicyPage />}></Route>
      </Route>

      {/* Auth + misc — no header/footer, full-screen layouts */}
      <Route element={<PlainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="confirm-email" element={<EmailConfirmPage />} />
        <Route path="accept-invite" element={<AcceptInvitePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>
    </>
  );
}
