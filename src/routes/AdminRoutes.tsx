import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import RequireAuth from "./RequireAuth";
import CourseBuilderPage from "../pages/admin/curriculum/CourseBuilder";
import PricingPage from "../pages/admin/curriculum/Pricing";
import CurriculumBuilderPage from "../pages/admin/curriculum/CurriculumBuilder";
import ReviewPage from "../pages/admin/curriculum/Review";
import CoursePage from "../pages/admin/curriculum/Course";
import UsersPage from "../pages/admin/users/UsersTable";

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses/:id" element={<CoursePage />} />
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
