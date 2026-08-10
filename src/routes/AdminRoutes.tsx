import { lazy } from "react";
import { Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import AdminSidebarLayout from "../layouts/AdminSidebarLayout";

const AdminDashboardPage = lazy(
  () => import("../features/admin/dashboard/pages/DashboardPage"),
);
const StudentsPage = lazy(
  () => import("../features/admin/students/pages/StudentsPage"),
);
const LessonsPage = lazy(
  () => import("../features/admin/lessons/pages/LessonsPage"),
);
const HomeworkPage = lazy(
  () => import("../features/admin/homework/pages/HomeworkPage"),
);
const HomeworkReviewPage = lazy(
  () => import("../features/admin/homework/pages/HomeworkReviewPage"),
);
const PaymentsPage = lazy(
  () => import("../features/admin/payments/pages/PaymentsPage"),
);
const MyProfilePage = lazy(
  () => import("../features/shared/profile/pages/MyProfilePage"),
);
const UserProfile = lazy(
  () => import("../features/admin/students/pages/StudentProfilePage"),
);
const LessonDetailPage = lazy(
  () => import("../features/shared/lessons/pages/LessonDetailPage"),
);
const StudentGoalsPage = lazy(
  () => import("../features/admin/students/pages/StudentGoalsPage"),
);
const AdminGoalDetailPage = lazy(
  () => import("../features/admin/students/pages/AdminGoalDetailPage"),
);

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth role="admin" />}>
      <Route element={<AdminSidebarLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/lessons" element={<LessonsPage />} />
        <Route path="/admin/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/admin/homework" element={<HomeworkPage />} />
        <Route
          path="/admin/homework/:id/review"
          element={<HomeworkReviewPage />}
        />

        <Route path="/admin/payment" element={<PaymentsPage />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route
          path="/admin/students/:id/goals"
          element={<StudentGoalsPage />}
        />
        <Route
          path="/admin/students/:id/goals/:goalId"
          element={<AdminGoalDetailPage />}
        />
      </Route>
    </Route>
  );
}
