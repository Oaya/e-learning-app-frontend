import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";

import SidebarLayout from "../layouts/SidebarLayout";
import CoursePage from "../features/admin/curriculum/pages/CoursePage";
import CourseBuilderPage from "../features/admin/curriculum/pages/CourseBuilderPage";
import CurriculumBuilderPage from "../features/admin/curriculum/pages/CurriculumBuilderPage";
import UsersPage from "../features/admin/users/pages/UsersPage";
import PricingPage from "../features/admin/curriculum/pages/PricingPage";
import ReviewPage from "../features/admin/curriculum/pages/ReviewPage";
import CoursesList from "../features/admin/curriculum/pages/CoursesListPage";
import AdminDashboardPage from "../features/admin/dashboard/pages/DashboardPage";

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
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>
    </Route>
  );
}
