import { lazy } from "react";
import { Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import SidebarLayout from "../layouts/SidebarLayout";

const StudentDashboard = lazy(
  () => import("../features/student/dashboard/pages/DashboardPage"),
);
const StudentLessonsPage = lazy(
  () => import("../features/student/lessons/pages/LessonsPage"),
);
const HomeworkSubmitPage = lazy(
  () => import("../features/student/homework/pages/HomeworkSubmitPage"),
);
const HomeworkViewPage = lazy(
  () => import("../features/student/homework/pages/HomeworkViewPage"),
);
const StudentHomeworkPage = lazy(
  () => import("../features/student/homework/pages/HomeworkPage"),
);
const StudentGoalsPage = lazy(
  () => import("../features/student/goals/pages/GoalsPage"),
);
const MyProfilePage = lazy(
  () => import("../features/shared/profile/pages/MyProfilePage"),
);

export default function StudentRoutes() {
  return (
    <Route element={<RequireAuth role="student" />}>
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/lessons" element={<StudentLessonsPage />} />
        <Route path="/student/homework" element={<StudentHomeworkPage />} />
        <Route
          path="/student/homework/:id/submit"
          element={<HomeworkSubmitPage />}
        />
        <Route
          path="/student/homework/:id/view"
          element={<HomeworkViewPage />}
        />
        <Route path="/student/goals" element={<StudentGoalsPage />} />
        <Route path="/student/profile" element={<MyProfilePage />} />
      </Route>
    </Route>
  );
}
