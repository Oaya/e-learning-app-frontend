import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </>
  );
}
