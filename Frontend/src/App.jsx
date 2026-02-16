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

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
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

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <GuestDashboard /> 
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          />

          

          {/* Ruta antigua /dash redirige a /dashboard */}
          <Route path="/dash" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
