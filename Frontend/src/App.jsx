import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CleanLayout from "./layouts/CleanLayout";
import Hero from "./pages/Hero";
import RoomPages from "./pages/RoomPages";
import RoomDetailPage from "./pages/RoomDetailPage";
import Login from "./pages/Login";
import CheckRates from "./pages/CheckRates";
import ReservationView from "./pages/ReservationView";
import ScrollToTop from "./components/ScrollToTop";
import DashBoard from "./pages/dashboard/DashboardHome";
import authService from "./services/authService";
import GuestDashboard from "./pages/GuestDashboard";

const PrivateRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const role = authService.getRole();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;

  return children;
};

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} />
        </Route>

        <Route element={<CleanLayout />}>
          <Route path="/rooms" element={<RoomPages />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check-rates" element={<CheckRates />} />
          <Route path="/reservation-view" element={<ReservationView />} />

          {/* Guest protected route */}
          <Route
            path="/guest/reservations"
            element={
              <PrivateRoute requiredRole="guest">
                <GuestDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin protected route */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute requiredRole="admin">
                <DashBoard />
              </PrivateRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/guest/reservations" />} />
          <Route path="/dash" element={<Navigate to="/guest/reservations" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
