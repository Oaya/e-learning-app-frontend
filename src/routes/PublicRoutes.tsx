import { Route } from "react-router-dom";
import HomePage from "../pages/public/Home";
import PricingPage from "../pages/public/Pricing";
import SignupPage from "../pages/public/Signup";
import LoginPage from "../pages/public/Login";
import EmailConfirmPage from "../pages/public/EmailConfirm";
import PublicLayout from "../layouts/PublicLayout";
import PlainLayout from "../layouts/PlainLayout";

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
      </Route>
    </>
  );
}
