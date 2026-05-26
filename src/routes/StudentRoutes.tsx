import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";

import SidebarLayout from "../layouts/SidebarLayout";

import StudentDashboard from "../features/student/dashboard/pages/DashboardPage";
import MyCoursesPage from "../features/student/courses/pages/MyCoursesPage";
import CoursePage from "../features/student/courses/pages/CoursePage";
import LessonPage from "../features/student/courses/pages/LessonPage";

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCoursesPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />
      </Route>
    </Route>
  );
}
