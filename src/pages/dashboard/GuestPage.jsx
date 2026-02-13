import React, { useState } from "react";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import GuestModal from "./modal/GuestModal";
import GuestDetailModal from "./modal/GuestDetailModal";

// Datos de ejemplo
const guestData = [
  {
    id: 1,
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@email.com",
    phone: "+57 300 123 4567",
    document: "1234567890",
    documentType: "ID",
    address: "Calle 123 #45-67",
    city: "Bogotá",
    country: "Colombia",
    dateOfBirth: "1985-03-15",
    totalStays: 5,
    lastVisit: "Jan 15, 2024",
    status: "Active",
    notes: "VIP guest, prefers room with ocean view"
  },
  {
    id: 2,
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+57 301 234 5678",
    document: "9876543210",
    documentType: "Passport",
    address: "Carrera 7 #12-34",
    city: "Medellín",
    country: "Colombia",
    dateOfBirth: "1990-07-22",
    totalStays: 3,
    lastVisit: "Dec 20, 2023",
    status: "Active",
    notes: "Business traveler, needs early check-in"
  },
  {
    id: 3,
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@email.com",
    phone: "+57 302 345 6789",
    document: "5555555555",
    documentType: "ID",
    city: "Cali",
    country: "Colombia",
    dateOfBirth: "1988-11-10",
    totalStays: 1,
    lastVisit: "Nov 5, 2023",
    status: "Inactive",
    notes: ""
  },
];

const kpiCards = [
  {
    title: "TOTAL GUESTS",
    value: "1,234",
    icon: Users,
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "NEW THIS MONTH",
    value: "87",
    icon: UserPlus,
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "ACTIVE",
    value: "456",
    icon: UserCheck,
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    title: "INACTIVE",
    value: "123",
    icon: UserX,
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  }
];

const GuestsPage = ({ theme }) => {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState(guestData);

  const isDark = theme.pageText.includes("text-white");

  const statusClass = (status) => {
    if (status === "Active") {
      return isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
    return isDark
      ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
      : "bg-slate-100 text-slate-700 border border-slate-200";
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleCreateGuest = () => {
    setSelectedGuest(null);
    setGuestModalOpen(true);
  };

  const handleViewDetails = (guest) => {
    setSelectedGuest(guest);
    setDetailModalOpen(true);
  };

  const handleEditGuest = (guest) => {
    setDetailModalOpen(false);
    setSelectedGuest(guest);
    setGuestModalOpen(true);
  };

  const handleSubmitGuest = (formData) => {
    if (selectedGuest) {
      // Update existing guest
      console.log("Update guest:", formData);
      setGuests(prev => 
        prev.map(g => g.id === selectedGuest.id ? { ...g, ...formData } : g)
      );
    } else {
      // Create new guest
      console.log("Create guest:", formData);
      const newGuest = {
        ...formData,
        id: Date.now(),
        totalStays: 0,
        lastVisit: 'Never',
        status: 'Active'
      };
      setGuests(prev => [newGuest, ...prev]);
    }
  };

  const handleDeleteGuest = (guestId) => {
    console.log("Delete guest:", guestId);
    setGuests(prev => prev.filter(g => g.id !== guestId));
  };

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Guests
          </h1>
          <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
            Manage guest information and history.
          </p>
        </div>
        <button
          onClick={handleCreateGuest}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium shadow-sm hover:shadow-md text-[clamp(0.82rem,0.78rem+0.22vw,0.95rem)]"
        >
          + New Guest
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {kpiCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <article
              key={card.title}
              className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${
                isDark ? card.dark : card.light
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-bold mb-1 ${card.iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}>
                    {card.value}
                  </p>
                  <p className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {card.title}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.iconWrap} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Guests Table */}
      <div
        className={`rounded-xl overflow-hidden ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <div className={`px-4 sm:px-5 py-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <h2 className="font-semibold text-[clamp(1rem,0.9rem+0.45vw,1.25rem)]">
            All Guests
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden p-4 space-y-3">
          {guests.map((guest) => (
            <div
              key={guest.id}
              onClick={() => handleViewDetails(guest)}
              className={`rounded-lg border p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    {guest.firstName} {guest.lastName}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {guest.email}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass(guest.status)}`}>
                  {guest.status}
                </span>
              </div>
              <div className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <p>📞 {guest.phone}</p>
                <p>🏨 {guest.totalStays} stays • Last: {guest.lastVisit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className={`text-xs font-medium ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
              <tr>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Guest
                </th>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Contact
                </th>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Document
                </th>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Location
                </th>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  History
                </th>
                <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {guests.map((guest) => (
                <tr
                  key={guest.id}
                  onClick={() => handleViewDetails(guest)}
                  className={`cursor-pointer transition-colors ${
                    isDark
                      ? "hover:bg-slate-800/50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">
                        {guest.firstName} {guest.lastName}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        ID: {guest.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm space-y-0.5">
                      <p>{guest.email}</p>
                      <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {guest.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p>{guest.documentType}</p>
                      <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {guest.document}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p>{guest.city}</p>
                      <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {guest.country}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p>{guest.totalStays} stays</p>
                      <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                        {guest.lastVisit}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass(guest.status)}`}>
                      {guest.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <GuestModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        isDark={isDark}
        guest={selectedGuest}
        onSubmit={handleSubmitGuest}
      />

      <GuestDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        guest={selectedGuest}
        theme={theme}
        onEdit={handleEditGuest}
        onDelete={handleDeleteGuest}
      />
    </section>
  );
};

export default GuestsPage;
