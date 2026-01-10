import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import SectionCreate from "../pages/admin/Curriculum/CurriculumBuilder";
import RequireAuth from "./RequireAuth";
import CourseBuilder from "../pages/admin/Curriculum/CourseBuilder";

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/admin/courses/new"
          element={<CourseBuilder mode="create" />}
        />
        <Route
          path="/admin/courses/:id"
          element={<CourseBuilder mode="edit" />}
        />
        <Route
          path="/admin/course/:id/sections/new"
          element={<SectionCreate />}
        />
      </Route>
    </Route>
  );
}
