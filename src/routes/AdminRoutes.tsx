import { lazy } from "react";
import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import SidebarLayout from "../layouts/SidebarLayout";

const CoursePage = lazy(
  () => import("../features/admin/curriculum/pages/CoursePage"),
);
const CourseBuilderPage = lazy(
  () => import("../features/admin/curriculum/pages/CourseBuilderPage"),
);
const CurriculumBuilderPage = lazy(
  () => import("../features/admin/curriculum/pages/CurriculumBuilderPage"),
);
const StudentsPage = lazy(
  () => import("../features/admin/students/pages/StudentsPage"),
);
const PricingPage = lazy(
  () => import("../features/admin/curriculum/pages/PricingPage"),
);
const ReviewPage = lazy(
  () => import("../features/admin/curriculum/pages/ReviewPage"),
);
const CoursesList = lazy(
  () => import("../features/admin/curriculum/pages/CoursesListPage"),
);
const AdminDashboardPage = lazy(
  () => import("../features/admin/dashboard/pages/DashboardPage"),
);
const MyProfilePage = lazy(
  () => import("../features/shared/profile/pages/MyProfilePage"),
);
const UserProfile = lazy(
  () => import("../features/shared/profile/pages/UserProfilePage"),
);

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<SidebarLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/courses/:id" element={<CoursePage />} />
        <Route path="/admin/courses" element={<CoursesList />} />
        <Route
          path="/admin/courses/new/course-builder"
          element={<CourseBuilderPage mode="create" />}
        />
        <Route
          path="/admin/courses/:id/course-builder"
          element={<CourseBuilderPage mode="edit" />}
        />
        <Route
          path="/admin/courses/:id/curriculum-builder"
          element={<CurriculumBuilderPage />}
        />
        <Route path="/admin/courses/:id/pricing" element={<PricingPage />} />
        <Route path="/admin/courses/:id/review" element={<ReviewPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />

        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Route>
    </Route>
  );
}
