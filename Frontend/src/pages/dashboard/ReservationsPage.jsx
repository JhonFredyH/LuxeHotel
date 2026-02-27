import React, { useState, useEffect, useCallback } from "react";
import { CheckCheck, Clock3, LogIn, LogOut } from "lucide-react";
import BookingDetailModal from "./modal/BookingDetailModal";
import ReservationModal from "./modal/ReservationModal";
import DataTable from "./components/DashboardTable";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("guest_token");

const authHeader = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── KPI config estática (solo estilos e iconos) ─────────────
const KPI_CONFIG = [
  {
    key: "confirmed",
    title: "Confirmed",
    Icon: CheckCheck,
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    key: "pending",
    title: "Pending",
    Icon: Clock3,
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-500",
  },
  {
    key: "checked_in",
    title: "Check-in Today",
    Icon: LogIn,
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    key: "checked_out",
    title: "Check-out Today",
    Icon: LogOut,
    light: "bg-white border-2 border-pink-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30",
    iconWrap: "bg-pink-500/20",
    iconColor: "text-pink-500",
  },
];

const ReservationsPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");

  // ── State ────────────────────────────────────────────────
  const [kpiTotals, setKpiTotals] = useState({
    confirmed: 0,
    pending: 0,
    checked_in: 0,
    checked_out: 0,
  });
  const [kpiLoading, setKpiLoading] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [tableKey, setTableKey] = useState(0); // fuerza re-fetch en DataTable

  // ── Cargar totales para KPIs ─────────────────────────────
  const fetchKpiTotals = useCallback(async () => {
    setKpiLoading(true);
    try {
      const results = await Promise.all(
        ["confirmed", "pending", "checked_in", "checked_out"].map((status) =>
          fetch(`${API_URL}/reservations?status=${status}&page=1&limit=1`, {
            headers: authHeader(),
          }).then((r) => r.json()),
        ),
      );
      setKpiTotals({
        confirmed: results[0].total ?? 0,
        pending: results[1].total ?? 0,
        checked_in: results[2].total ?? 0,
        checked_out: results[3].total ?? 0,
      });
    } catch {
      // silencioso, los KPIs quedan en 0
    } finally {
      setKpiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpiTotals();
  }, [fetchKpiTotals]);

  // ── Status badge ─────────────────────────────────────────
  const statusClass = (status) => {
    const s = (status ?? "").toLowerCase();
    if (s === "confirmed")
      return isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (s.includes("check-in") || s === "checked_in")
      return isDark
        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
        : "bg-blue-100 text-blue-700 border border-blue-200";
    if (s.includes("check-out") || s === "checked_out")
      return isDark
        ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
        : "bg-pink-100 text-pink-700 border border-pink-200";
    if (s === "cancelled")
      return isDark
        ? "bg-red-500/20 text-red-300 border border-red-500/30"
        : "bg-red-100 text-red-700 border border-red-200";
    // pending y cualquier otro
    return isDark
      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
      : "bg-amber-100 text-amber-700 border border-amber-200";
  };

  // ── Crear reserva ────────────────────────────────────────
  const handleCreateReservation = () => {
    setSelectedReservation(null);
    setReservationModalOpen(true);
  };

  const handleSubmitNewReservation = async (formData) => {
    if (!formData.roomId) {
      alert("Please select a room");
      return;
    }
    if (!formData.email) {
      alert("Please enter guest email");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    try {
      const nameParts = (formData.guestName ?? "").trim().split(" ");
      const firstName = nameParts[0] ?? "Guest";
      const lastName = nameParts.slice(1).join(" ") || "-";

      const body = {
        room_id: formData.roomId,
        room_number: formData.roomNumber,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        adults: 1,
        children: 0,
        special_requests: formData.notes ?? "",
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone ?? "",
      };

      console.log("Sending reservation:", body);

      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Mostrar el error real del backend
        const detail = Array.isArray(err.detail)
          ? err.detail.map((e) => `${e.loc?.join(".")}: ${e.msg}`).join("\n")
          : err.detail || "Error creating reservation";
        alert(detail);
        return;
      }

      setTableKey((k) => k + 1);
      fetchKpiTotals();
    } catch {
      alert("Connection error");
    }
  };

  // ── Ver detalles ─────────────────────────────────────────
  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDetailModalOpen(true);
  };

  // ── Editar ───────────────────────────────────────────────
  const handleEditReservation = (reservation) => {
    setDetailModalOpen(false);
    setSelectedReservation(reservation);
    setReservationModalOpen(true);
  };

  const handleUpdateReservation = async (formData) => {
    if (!selectedReservation?.id) return;
    try {
      const res = await fetch(
        `${API_URL}/reservations/${selectedReservation.id}`,
        {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify({
            room_number: formData.roomNumber,
            check_in_date: formData.checkIn,
            check_out_date: formData.checkOut,
            special_requests: formData.notes,
          }),
        },
      );
      if (!res.ok) {
        alert("Error updating reservation");
        return;
      }
      setTableKey((k) => k + 1);
      fetchKpiTotals();
    } catch {
      alert("Connection error");
    }
  };

  // ── Check-in ─────────────────────────────────────────────
  const handleCheckIn = async (reservationId) => {
    if (!window.confirm("Confirm check-in for this guest?")) return;
    try {
      const res = await fetch(
        `${API_URL}/reservations/${reservationId}/checkin`,
        {
          method: "POST",
          headers: authHeader(),
        },
      );
      if (!res.ok) {
        alert("Error performing check-in");
        return;
      }
      setDetailModalOpen(false);
      setTableKey((k) => k + 1);
      fetchKpiTotals();
    } catch {
      alert("Connection error");
    }
  };

  // ── Check-out ────────────────────────────────────────────
  const handleCheckOut = async (reservationId) => {
    if (!window.confirm("Confirm check-out for this guest?")) return;
    try {
      const res = await fetch(
        `${API_URL}/reservations/${reservationId}/checkout`,
        {
          method: "POST",
          headers: authHeader(),
        },
      );
      if (!res.ok) {
        alert("Error performing check-out");
        return;
      }
      setDetailModalOpen(false);
      setTableKey((k) => k + 1);
      fetchKpiTotals();
    } catch {
      alert("Connection error");
    }
  };

  // ── Cancelar ─────────────────────────────────────────────
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      const res = await fetch(
        `${API_URL}/reservations/${reservationId}/cancel`,
        {
          method: "POST",
          headers: authHeader(),
        },
      );
      if (!res.ok) {
        alert("Error cancelling reservation");
        return;
      }
      setDetailModalOpen(false);
      setTableKey((k) => k + 1);
      fetchKpiTotals();
    } catch {
      alert("Connection error");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Reservations
          </h1>
          <p
            className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}
          >
            Manage bookings, arrivals and departures.
          </p>
        </div>
        <button
          onClick={handleCreateReservation}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium shadow-sm hover:shadow-md text-[clamp(0.82rem,0.78rem+0.22vw,0.95rem)]"
        >
          + New Reservation
        </button>
      </div>

      {/* KPI Cards — datos reales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {KPI_CONFIG.map(
          ({ key, title, Icon, light, dark, iconWrap, iconColor }) => {
            const value = kpiTotals?.[key] ?? 0;

            return (
              <article
                key={key}
                className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${
                  isDark ? dark : light
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`font-bold mb-1 ${iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}
                    >
                      {kpiLoading ? (
                        <span className="inline-block w-10 h-7 rounded bg-slate-200 animate-pulse" />
                      ) : (
                        value.toLocaleString()
                      )}
                    </p>

                    <p
                      className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {title}
                    </p>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-lg ${iconWrap} flex items-center justify-center shrink-0`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 ${iconColor}`}
                        strokeWidth={2.2}
                      />
                    )}
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>

      {/* Reservations Table */}
      <div
        className={`rounded-xl overflow-hidden ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <div
          className={`px-4 sm:px-5 py-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}
        >
          <h2 className="font-semibold text-[clamp(1rem,0.9rem+0.45vw,1.25rem)]">
            All Reservations
          </h2>
        </div>

        {/* DataTable maneja su propio fetch + paginación */}
        <DataTable
          key={tableKey}
          isDark={isDark}
          statusClass={statusClass}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Modales */}
      <BookingDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        reservation={selectedReservation}
        theme={theme}
        onEdit={handleEditReservation}
        onCancel={handleCancelReservation}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onPrint={handlePrintInvoice}
      />

      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        isDark={isDark}
        reservation={selectedReservation}
        onSubmit={
          selectedReservation
            ? handleUpdateReservation
            : handleSubmitNewReservation
        }
      />
    </section>
  );
};

export default ReservationsPage;
