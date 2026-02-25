import React, { useEffect, useState } from "react";
import { Check, Clock, Wrench, Sparkles } from "lucide-react";
import RoomModal from "./modal/RoomModal";

const API = "http://localhost:8000";

const statusConfig = {
  available: { label: "Available", icon: "check", color: "emerald" },
  occupied: { label: "Occupied", icon: "clock", color: "blue" },
  maintenance: { label: "Maintenance", icon: "wrench", color: "amber" },
  cleaning: { label: "Cleaning", icon: "sparkles", color: "purple" },
};

const getIconComponent = (name) =>
  ({ check: Check, clock: Clock, wrench: Wrench, sparkles: Sparkles })[name] ||
  Check;

const RoomsPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");

  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    available: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    total: 0,
  });
  const [floors, setFloors] = useState(["All"]);
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roomsRes, statsRes, floorsRes] = await Promise.all([
        fetch(`${API}/rooms-admin`, { headers }),
        fetch(`${API}/rooms-admin/stats`, { headers }),
        fetch(`${API}/rooms-admin/floors`, { headers }),
      ]);
      const roomsData = await roomsRes.json();
      const statsData = await statsRes.json();
      const floorsData = await floorsRes.json();

      setRooms(roomsData.data || []);
      setStats(statsData);
      setFloors(floorsData.floors || ["All"]);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Cerrar menú al click fuera ─────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-room-menu]")) setOpenMenuId(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Filtrado por floor ─────────────────────────────────────
  const filteredRooms =
    selectedFloor === "All"
      ? rooms
      : rooms.filter((r) => r.floor === selectedFloor);

  // ── Status change ──────────────────────────────────────────
  const handleStatusChange = async (roomTypeId, newStatus) => {
    try {
      await fetch(`${API}/rooms-admin/${roomTypeId}/status`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Actualizar local
      setRooms((prev) =>
        prev.map((r) =>
          r.room_type_id === roomTypeId ? { ...r, status: newStatus } : r,
        ),
      );
      // Refrescar stats
      const statsRes = await fetch(`${API}/rooms-admin/stats`, { headers });
      setStats(await statsRes.json());
    } catch (err) {
      console.error("Error updating status:", err);
    }
    setOpenMenuId(null);
  };

  const statusClass = (status) => {
    const colors = {
      available: isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200",
      occupied: isDark
        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
        : "bg-blue-100 text-blue-700 border border-blue-200",
      maintenance: isDark
        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        : "bg-amber-100 text-amber-700 border border-amber-200",
      cleaning: isDark
        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
        : "bg-purple-100 text-purple-700 border border-purple-200",
    };
    return colors[status] || colors.available;
  };

  const statusDotClass = (status) =>
    ({
      available: "bg-emerald-500",
      occupied: "bg-blue-500",
      maintenance: "bg-amber-500",
      cleaning: "bg-purple-500",
    })[status] || "bg-emerald-500";

  const kpiColor = (color) =>
    ({
      emerald: {
        light: "bg-white border-2 border-emerald-200 shadow-sm",
        dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
        iconWrap: "bg-emerald-500/20",
        iconColor: "text-emerald-600",
      },
      blue: {
        light: "bg-white border-2 border-blue-200 shadow-sm",
        dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
        iconWrap: "bg-blue-500/20",
        iconColor: "text-blue-600",
      },
      amber: {
        light: "bg-white border-2 border-amber-200 shadow-sm",
        dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
        iconWrap: "bg-amber-500/20",
        iconColor: "text-amber-600",
      },
      purple: {
        light: "bg-white border-2 border-purple-200 shadow-sm",
        dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
        iconWrap: "bg-purple-500/20",
        iconColor: "text-purple-600",
      },
    })[color];

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Rooms
          </h1>
          <p
            className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}
          >
            Manage room availability and status.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const c = kpiColor(cfg.color);
          const Icon = getIconComponent(cfg.icon);
          return (
            <article
              key={key}
              className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${isDark ? c.dark : c.light}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`font-bold mb-1 ${c.iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}
                  >
                    {loading ? "—" : stats[key]}
                  </p>
                  <p
                    className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {cfg.label.toUpperCase()}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg ${c.iconWrap} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${c.iconColor}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floor Filter */}
      <div
        className={`rounded-xl overflow-hidden mb-6 ${isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200"}`}
      >
        <div className="flex overflow-x-auto scrollbar-hide">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 ${
                selectedFloor === floor
                  ? isDark
                    ? "border-emerald-500 text-emerald-300"
                    : "border-emerald-600 text-emerald-700"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Rooms Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <article
              key={room.id}
              className={`rounded-xl overflow-visible transition-all hover:scale-[1.01] ${
                isDark
                  ? "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
                  : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Foto */}
              {room.image_url && (
                <div className="h-44 overflow-hidden rounded-t-xl">
                  <img
                    src={room.image_url}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Header card */}
              <div
                className={`p-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[clamp(1rem,0.95rem+0.2vw,1.15rem)]">
                      {room.number}
                    </p>
                    <p
                      className={`text-sm mt-0.5 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
                    >
                      {room.name}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {room.view_type} · {room.size_m2}m²
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg font-medium text-xs ${statusClass(room.status)}`}
                  >
                    {statusConfig[room.status]?.label || room.status}
                  </span>
                </div>
              </div>

              {/* Body card */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`font-medium text-[clamp(0.86rem,0.82rem+0.25vw,1rem)] ${isDark ? "text-slate-200" : "text-slate-800"}`}
                  >
                    ${room.price_per_night.toLocaleString()}{" "}
                    <span className="font-normal text-sm">/night</span>
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    👥 {room.max_guests} guests · ⭐ {room.rating}
                  </p>
                </div>

                <div className="flex gap-3" data-room-menu>
                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    View details
                  </button>

                  {/* Menú contextual */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((p) => (p === room.id ? null : room.id));
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-slate-700/60 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {openMenuId === room.id && (
                      <div
                        className={`absolute right-0 top-12 z-30 w-56 rounded-2xl border p-4 ${isDark ? "bg-slate-800 border-slate-700 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}
                      >
                        <p
                          className={`text-xs font-semibold uppercase mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                        >
                          Change Status
                        </p>
                        <div className="space-y-1">
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() =>
                                handleStatusChange(room.room_type_id, key)
                              }
                              className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                                room.status === key
                                  ? isDark
                                    ? "bg-slate-700"
                                    : "bg-slate-100"
                                  : isDark
                                    ? "hover:bg-slate-700/70"
                                    : "hover:bg-slate-50"
                              }`}
                            >
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${statusDotClass(key)}`}
                              />
                              <span
                                className={`text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}
                              >
                                {cfg.label}
                              </span>
                              {room.status === key && (
                                <span className="ml-auto text-xs text-emerald-500">
                                  ✓
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={selectedRoom}
        isDark={isDark}
        onStatusChange={(id, status) => handleStatusChange(id, status)}
      />
    </section>
  );
};

export default RoomsPage;
