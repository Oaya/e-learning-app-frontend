import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import CourseCreate from "../pages/admin/Curriculum/CourseCreate";
import SectionCreate from "../pages/admin/Curriculum/CurriculumBuilder";
import CourseEdit from "../pages/admin/Curriculum/CourseEdit";
import RequireAuth from "./RequireAuth";

export default function AdminRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses/new" element={<CourseCreate />} />
        <Route path="/admin/courses/:id" element={<CourseEdit />} />
        <Route
          path="/admin/course/:id/sections/new"
          element={<SectionCreate />}
        />
      </Route>
    </Route>
  );
}
