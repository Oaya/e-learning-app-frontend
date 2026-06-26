import { lazy } from "react";
import { Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import AdminSidebarLayout from "../layouts/AdminSidebarLayout";

const AdminDashboardPage = lazy(() => import("../features/admin/dashboard/pages/DashboardPage"));
const StudentsPage = lazy(() => import("../features/admin/students/pages/StudentsPage"));
const SessionsPage = lazy(() => import("../features/admin/sessions/pages/SessionsPage"));
const HomeworkPage = lazy(() => import("../features/admin/homework/pages/HomeworkPage"));
const HomeworkReviewPage = lazy(() => import("../features/admin/homework/pages/HomeworkReviewPage"));
const GoalsPage = lazy(() => import("../features/admin/goals/pages/GoalsPage"));
const RecordingsPage = lazy(() => import("../features/admin/recordings/pages/RecordingsPage"));
const PaymentsPage = lazy(() => import("../features/admin/payments/pages/PaymentsPage"));
const MyProfilePage = lazy(() => import("../features/shared/profile/pages/MyProfilePage"));
const UserProfile = lazy(() => import("../features/shared/profile/pages/UserProfilePage"));

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<AdminSidebarLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/sessions" element={<SessionsPage />} />
        <Route path="/admin/homework" element={<HomeworkPage />} />
        <Route path="/admin/homework/:id/review" element={<HomeworkReviewPage />} />
        <Route path="/admin/goals" element={<GoalsPage />} />
        <Route path="/admin/recording" element={<RecordingsPage />} />
        <Route path="/admin/payment" element={<PaymentsPage />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Route>
    </Route>
  );
}
