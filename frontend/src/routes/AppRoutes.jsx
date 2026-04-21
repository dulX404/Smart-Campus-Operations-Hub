import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/login/loginPage";
import DashboardPage from "../components/pages/dashboard/DashboardPage";
import BookingsPage from "../components/pages/bookings/BookingsPage";
import ResourcesPage from "../components/pages/resources/ResourcesPage";
import TicketsPage from "../components/pages/tickets/TicketsPage";
import NotFoundPage from "../components/pages/notfound/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
