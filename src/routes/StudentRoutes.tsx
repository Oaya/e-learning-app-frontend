import { lazy } from "react";
import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import SidebarLayout from "../layouts/SidebarLayout";

const StudentDashboard = lazy(
  () => import("../features/student/dashboard/pages/DashboardPage"),
);
const MyCoursesPage = lazy(
  () => import("../features/student/courses/pages/MyCoursesPage"),
);
const CoursePage = lazy(
  () => import("../features/student/courses/pages/CoursePage"),
);
const LessonPage = lazy(
  () => import("../features/student/courses/pages/LessonPage"),
);
const MyProfilePage = lazy(
  () => import("../features/shared/profile/pages/MyProfilePage"),
);
const UserProfile = lazy(
  () => import("../features/shared/profile/pages/UserProfilePage"),
);

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCoursesPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />
      </Route>

      {/* Profile Route with Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Route>
    </Route>
  );
}
