import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from "sonner";
import StudentRoutes from "./routes/StudentRoutes";
import RequireAuth from "./routes/RequireAuth";

const LessonMeetingPage = lazy(
  () => import("./features/shared/lessons/pages/LessonMeetingPage"),
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors duration={2000} offset={{ top: 64 }} />
      <Suspense>
        <Routes>
          {PublicRoutes()}
          {AdminRoutes()}
          {StudentRoutes()}
          <Route element={<RequireAuth />}>
            <Route path="/lessons/:id/meeting" element={<LessonMeetingPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
