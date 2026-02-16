import React, { useEffect, useState } from 'react';
import { Check, Clock, Wrench, Sparkles } from 'lucide-react';
import RoomModal from './modal/RoomModal';

const initialRoomData = [
  {
    id: 101,
    number: "101",
    type: "STANDARD",
    status: "Available",
    price: "$120",
    priceUnit: "/night",
    floor: "Floor 1",
    capacity: "2 guests",
    amenities: "WiFi, TV, Air Conditioning",
    view: "Garden View",
    details: "Standard room with double bed"
  },
  {
    id: 102,
    number: "102",
    type: "STANDARD",
    status: "Occupied",
    price: "$120",
    priceUnit: "/night",
    floor: "Floor 1",
    guest: "Juan Pérez",
    checkOut: "14/02",
    capacity: "2 guests",
    amenities: "WiFi, TV, Air Conditioning",
    view: "Garden View",
    details: "Standard room with double bed"
  },
  {
    id: 103,
    number: "103",
    type: "DELUXE",
    status: "Available",
    price: "$180",
    priceUnit: "/night",
    floor: "Floor 1",
    capacity: "2 guests",
    amenities: "WiFi, TV, Air Conditioning, Mini-bar",
    view: "Pool View",
    details: "Deluxe room with king bed"
  },
  {
    id: 201,
    number: "201",
    type: "SUITE",
    status: "Available",
    price: "$280",
    priceUnit: "/night",
    floor: "Floor 2",
    capacity: "4 guests",
    amenities: "WiFi, TV, Air Conditioning, Mini-bar, Jacuzzi",
    view: "360° View",
    details: "Suite with living area and balcony"
  },
  {
    id: 202,
    number: "202",
    type: "PREMIUM",
    status: "Maintenance",
    price: "$350",
    priceUnit: "/night",
    floor: "Floor 2",
    capacity: "3 guests",
    amenities: "WiFi, TV, Air Conditioning, Mini-bar, Jacuzzi, Kitchen",
    view: "Sea View",
    details: "Premium suite with integrated kitchen"
  },
  {
    id: 301,
    number: "301",
    type: "PRESIDENCIAL",
    status: "Cleaning",
    price: "$520",
    priceUnit: "/night",
    floor: "Floor 3",
    capacity: "6 guests",
    amenities: "WiFi, TV, Air Conditioning, Mini-bar, Jacuzzi, Kitchen, Living Room",
    view: "Sea View",
    details: "Presidential suite with meeting room"
  }
];

const kpiCards = [
  {
    title: "AVAILABLE",
    value: "24",
    icon: "check",
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "OCCUPIED",
    value: "156",
    icon: "clock",
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "MAINTENANCE",
    value: "8",
    icon: "wrench",
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  },
  {
    title: "CLEANING",
    value: "12",
    icon: "sparkles",
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  }
];

const floors = ["All", "Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6"];
const roomStatusOptions = ["Available", "Occupied", "Maintenance", "Cleaning"];

const RoomsPage = ({ theme }) => {
  // Estados
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [rooms, setRooms] = useState(initialRoomData);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const isDark = theme.pageText.includes("text-white");

  // Cerrar menú contextual al hacer click fuera
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('[data-room-menu]')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const statusClass = (status) => {
    if (status === "Available") {
      return isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
    if (status === "Occupied") {
      return isDark
        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
        : "bg-blue-100 text-blue-700 border border-blue-200";
    }
    if (status === "Maintenance") {
      return isDark
        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        : "bg-amber-100 text-amber-700 border border-amber-200";
    }
    return isDark
      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
      : "bg-purple-100 text-purple-700 border border-purple-200";
  };

  const statusDotClass = (status) => {
    if (status === "Available") return "bg-emerald-500";
    if (status === "Occupied") return "bg-blue-500";
    if (status === "Maintenance") return "bg-amber-500";
    return "bg-purple-500";
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "check":
        return Check;
      case "clock":
        return Clock;
      case "wrench":
        return Wrench;
      case "sparkles":
        return Sparkles;
      default:
        return Check;
    }
  };

  // ============================================
  // HANDLERS PARA EL MODAL REUTILIZABLE
  // ============================================
  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleStatusChange = (roomId, nextStatus) => {
    console.log(`Cambiar estado de habitación ${roomId} a ${nextStatus}`);
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, status: nextStatus } : room
      )
    );
    // TODO: Actualizar en API
    // api.patch(`/rooms/${roomId}`, { status: nextStatus })
  };

  const handleEditRoom = (room) => {
    console.log('Editar habitación:', room);
    // TODO: Implementar lógica de edición
    // Podrías abrir otro modal o navegar a una página de edición
    setOpenMenuId(null);
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('¿Estás seguro de eliminar esta habitación?')) {
      console.log('Eliminar habitación:', roomId);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
      setOpenMenuId(null);
      // TODO: Eliminar en API
      // api.delete(`/rooms/${roomId}`)
    }
  };

  // ============================================
  // HANDLERS PARA MENÚ CONTEXTUAL
  // ============================================
  const handleQuickStatusChange = (room, status) => {
    handleStatusChange(room.id, status);
    setOpenMenuId(null);
  };

  const handleQuickEdit = (room) => {
    handleViewDetails(room);
    setOpenMenuId(null);
  };

  // ============================================
  // FILTRADO
  // ============================================
  const filteredRooms = selectedFloor === "All"
    ? rooms
    : rooms.filter((room) => room.floor === selectedFloor);

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Rooms
          </h1>
          <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
            Manage room availability and status.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {kpiCards.map((card) => {
          const IconComponent = getIconComponent(card.icon);
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

      {/* Floor Filter */}
      <div className={`rounded-xl overflow-hidden mb-6 ${isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200"}`}>
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

      {/* Rooms Grid */}
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
            <div className={`p-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[clamp(1.15rem,1.05rem+0.2vw,1.3rem)]">{room.number}</p>
                  <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{room.type}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-medium text-xs ${statusClass(room.status)}`}>
                  {room.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className={`font-medium text-[clamp(0.86rem,0.82rem+0.25vw,1rem)] ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  {room.price} <span className="font-normal">{room.priceUnit}</span>
                </p>
                {room.guest && (
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Check-out: {room.checkOut}
                  </p>
                )}
              </div>

              <div className="flex gap-3" data-room-menu>
                <button
                  onClick={() => handleViewDetails(room)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm text-white ${isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  View details
                </button>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) => (prev === room.id ? null : room.id));
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark
                        ? "bg-slate-700/60 hover:bg-slate-700 text-slate-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {openMenuId === room.id && (
                    <div
                      className={`absolute right-0 top-12 z-30 w-72 rounded-2xl border p-4 ${
                        isDark
                          ? "bg-slate-800 border-slate-700 shadow-2xl shadow-slate-950/50"
                          : "bg-white border-slate-200 shadow-xl"
                      }`}
                    >
                      <p className={`text-sm font-medium mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Change Status
                      </p>

                      <div className="space-y-2 mb-4">
                        {roomStatusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleQuickStatusChange(room, status)}
                            className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                              isDark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${statusDotClass(status)}`} />
                            <span className={`${isDark ? "text-slate-100" : "text-slate-800"}`}>{status}</span>
                          </button>
                        ))}
                      </div>

                      <div className={`pt-3 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                        <p className={`text-sm font-medium mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Actions
                        </p>

                        <button
                          onClick={() => handleQuickEdit(room)}
                          className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                            isDark ? "text-slate-200 hover:bg-slate-700/70" : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m2 0h.01M5 7a2 2 0 012-2h1m10 0h1a2 2 0 012 2v1m0 8v1a2 2 0 01-2 2h-1m-8 0H7a2 2 0 01-2-2v-1m0-8V7a2 2 0 012-2m9 7l-7 7-3 1 1-3 7-7a2.121 2.121 0 013 3z" />
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12m-1 0v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 0V5a2 2 0 012-2h0a2 2 0 012 2v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ============================================ */}
      {/* MODAL REUTILIZABLE */}
      {/* ============================================ */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={selectedRoom}
        isDark={isDark}
        onStatusChange={handleStatusChange}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
      />
    </section>
  );
};

export default RoomsPage;
