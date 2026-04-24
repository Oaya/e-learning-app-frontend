import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";

import SidebarLayout from "../layouts/SidebarLayout";

import StudentDashboard from "../features/student/dashboard/pages/DashboardPage";
import CoursePage from "../features/student/courses/pages/CoursePage";

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/courses/:id" element={<CoursePage />} />
      </Route>
    </Route>
  );
}
