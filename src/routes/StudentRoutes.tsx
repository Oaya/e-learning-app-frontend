import { lazy } from "react";
import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import SidebarLayout from "../layouts/SidebarLayout";

const StudentDashboard = lazy(
  () => import("../features/student/dashboard/pages/DashboardPage"),
);
const StudentSessionsPage = lazy(
  () => import("../features/student/sessions/pages/SessionsPage"),
);
const StudentHomeworkPage = lazy(
  () => import("../features/student/homework/pages/HomeworkPage"),
);
const StudentGoalsPage = lazy(
  () => import("../features/student/goals/pages/GoalsPage"),
);
const StudentRecordingsPage = lazy(
  () => import("../features/student/recordings/pages/RecordingsPage"),
);
const MyProfilePage = lazy(
  () => import("../features/shared/profile/pages/MyProfilePage"),
);

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth role="student" />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/sessions" element={<StudentSessionsPage />} />
        <Route path="/student/homework" element={<StudentHomeworkPage />} />
        <Route path="/student/goals" element={<StudentGoalsPage />} />
        <Route path="/student/recordings" element={<StudentRecordingsPage />} />
        <Route path="/student/profile" element={<MyProfilePage />} />
      </Route>
    </Route>
  );
}
