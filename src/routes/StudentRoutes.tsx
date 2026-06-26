import { lazy } from "react";
import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import SidebarLayout from "../layouts/SidebarLayout";

const StudentDashboard = lazy(
  () => import("../features/student/dashboard/pages/DashboardPage"),
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
      </Route>

      {/* Profile Route with Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Route>
    </Route>
  );
}
