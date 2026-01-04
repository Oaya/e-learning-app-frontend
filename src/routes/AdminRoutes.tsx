import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import CourseCreate from "../pages/admin/Courses/CourseCreate";
import ModuleCreate from "../pages/admin/Modules/ModuleCreate";
import CourseEdit from "../pages/admin/Courses/CourseEdit";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses/new" element={<CourseCreate />} />
        <Route path="/admin/courses/:id" element={<CourseEdit />} />
        <Route
          path="/admin/course/:id/modules/new"
          element={<ModuleCreate />}
        />
      </Route>
    </>
  );
}
