import React, { useState } from 'react';
import ReservationDrawer from '../dashboard/ReservationDrawer';
import Card from './components/DashboardCard'
import DataTable from './components/DashboardTable'
import { reservationData, kpiCards } from '../../data/reservationData'

const ReservationPage = ({ theme }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  const isDark = theme.pageText.includes("text-white");

  const statusClass = (status) => {
    if (status === "Confirmada") {
      return isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
    if (status === "Check-in") {
      return isDark
        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
        : "bg-blue-100 text-blue-700 border border-blue-200";
    }
    return isDark
      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
      : "bg-amber-100 text-amber-700 border border-amber-200";
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDrawerOpen(true);
  };

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Reservations
          </h1>
          <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
            Manage bookings, arrivals and departures.
          </p>
        </div>
        <button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium shadow-sm hover:shadow-md text-[clamp(0.82rem,0.78rem+0.22vw,0.95rem)]">
          + New Reservation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {kpiCards.map((card) => (
          <Card 
            key={card.title} 
            type="kpi" 
            data={card} 
            isDark={isDark} 
          />
        ))}
      </div>

      {/* Reservations Table */}
      <div
        className={`rounded-xl overflow-hidden ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <div className={`px-4 sm:px-5 py-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <h2 className="font-semibold text-[clamp(1rem,0.9rem+0.45vw,1.25rem)]">
            All Reservations
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden p-4 space-y-3">
          {reservationData.map((reservation) => (
            <Card
              key={reservation.id}
              type="reservation"
              data={reservation}
              theme={theme}
              isDark={isDark}
              statusClass={statusClass}
              onClick={() => handleViewDetails(reservation)}
            />
          ))}
        </div>

        {/* Desktop Table */}
        <DataTable 
          data={reservationData} 
          isDark={isDark} 
          statusClass={statusClass}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Drawer */}
      <ReservationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        reservation={selectedReservation}
        theme={theme}
      />
    </section>
  );
};

export default ReservationPage;
