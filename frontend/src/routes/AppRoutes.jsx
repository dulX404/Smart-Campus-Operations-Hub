import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/login/loginPage";
import StudentDashboardPage from "../components/pages/dashboard/Student/DashboardPage";
import AdminDashboardPage from "../components/pages/dashboard/Admin/DashboardPage";
import BookingsPage from "../components/pages/bookings/BookingsPage";
import ResourcesPage from "../components/pages/resources/ResourcesPage";
import TicketsPage from "../components/pages/tickets/TicketsPage";
import NotificationsPage from "../components/pages/notifications/NotificationsPage";
import NotFoundPage from "../components/pages/notfound/NotFoundPage";
import UnauthorizedPage from "../components/pages/unauthorized/UnauthorizedPage";
import ProtectedRoute from "../common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]} />}>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/admin-dashboard" element={<MainLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
