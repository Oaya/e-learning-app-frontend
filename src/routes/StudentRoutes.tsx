import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";

import SidebarLayout from "../layouts/SidebarLayout";

import StudentDashboard from "../features/student/dashboard/pages/DashboardPage";
import CoursePage from "../features/student/courses/pages/CoursePage";
import LessonPage from "../features/student/courses/pages/LessonPage";

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />
      </Route>
    </Route>
  );
}
