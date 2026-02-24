import React, { useState, useEffect } from "react";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import GuestModal from "./modal/GuestModal";
import GuestDetailModal from "./modal/GuestDetailModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  },
];

const GuestsPage = ({ theme }) => {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const isDark = theme.pageText.includes("text-white");

  // ── Cargar guests desde la API ──────────────────────────
  useEffect(() => {
    const fetchGuests = async () => {
      setLoadingGuests(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API_URL}/guests`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        // El endpoint devuelve { data: [...], total, page, limit }
        setGuests(data.data ?? data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingGuests(false);
      }
    };
    fetchGuests();
  }, []);

  // ── Handlers ────────────────────────────────────────────
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

  // Recibe el guest guardado que devuelve el backend
  const handleSubmitGuest = (savedGuest) => {
    if (selectedGuest) {
      // Actualizar en la lista
      setGuests((prev) =>
        prev.map((g) => (g.id === savedGuest.id ? savedGuest : g))
      );
    } else {
      // Agregar al inicio de la lista
      setGuests((prev) => [savedGuest, ...prev]);
    }
  };

  const handleDeleteGuest = async (guestId) => {
  try {
    const res = await fetch(`${API_URL}/guests/${guestId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.detail || `Error ${res.status} al eliminar el guest`);
      return;
    }

    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  } catch {
    alert("Error de conexión al eliminar el guest");
  }
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

        {/* Loading */}
        {loadingGuests && (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className={`ml-3 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Loading guests...
            </span>
          </div>
        )}

        {/* Error */}
        {fetchError && !loadingGuests && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-500">⚠️ {fetchError}</p>
          </div>
        )}

        {/* Empty */}
        {!loadingGuests && !fetchError && guests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Users className={`w-10 h-10 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              No guests yet. Create your first guest!
            </p>
          </div>
        )}

        {/* Mobile Cards */}
        {!loadingGuests && !fetchError && guests.length > 0 && (
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
                      {guest.first_name} {guest.last_name}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {guest.email}
                    </p>
                  </div>
                </div>
                <div className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <p>📞 {guest.phone}</p>
                  <p>📍 {guest.city} {guest.country ? `· ${guest.country}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {!loadingGuests && !fetchError && guests.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className={`text-xs font-medium ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                <tr>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Guest</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Email</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Phone</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Document</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Location</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Registered</th>
                  <th className={`px-4 py-3 text-left ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    onClick={() => handleViewDetails(guest)}
                    className={`cursor-pointer transition-colors ${
                      isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">
                        {guest.first_name} {guest.last_name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">{guest.email}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {guest.phone}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p>{guest.document_type}</p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {guest.document_number}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p>{guest.city}</p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {guest.country}
                        </p>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {new Date(guest.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewDetails(guest)}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 transition-colors"
                      >
                        Active
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
