// src/pages/GuestDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  X,
  Bell,
  Moon,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";

const GuestDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Datos de ejemplo - esto vendrá de tu API
  const user = {
    name: "Alexander",
    role: "Guest",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  const upcomingReservations = [
    {
      id: 1,
      refNumber: "AT-98231",
      status: "CONFIRMED",
      location: "STOCKHOLM CENTRAL",
      roomName: "Serene Garden Loft",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
      checkIn: "Oct 12, 2023",
      checkOut: "Oct 15, 2023",
      guests: 2,
      size: "80M²",
      view: "GARDEN",
      amenities: "BALCONY",
    },
    {
      id: 2,
      refNumber: "AT-11245",
      status: "CONFIRMED",
      location: "COPENHAGEN WATERFRONT",
      roomName: "Harbor View Suite",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
      checkIn: "Dec 22, 2023",
      checkOut: "Dec 28, 2023",
      guests: 1,
      size: "45M²",
      view: "CITY",
      amenities: "BALCONY",
    },
  ];

  const pastReservations = [
    {
      id: 3,
      refNumber: "AT-87654",
      status: "COMPLETED",
      location: "PARIS DOWNTOWN",
      roomName: "Luxury Suite Paris",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
      checkIn: "Aug 10, 2023",
      checkOut: "Aug 15, 2023",
      guests: 2,
      size: "55M²",
      view: "CITY",
      amenities: "BALCONY",
    },
  ];

  const handleCancelStay = (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      console.log("Canceling reservation:", id);
    }
  };

  const ReservationCard = ({ reservation, isPast = false }) => (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Imagen */}
        <div className="relative lg:w-[320px] h-64 lg:h-auto flex-shrink-0">
          <img
            src={reservation.image}
            alt={reservation.roomName}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-800 tracking-wide">
            {reservation.status}
          </span>
        </div>

        {/* Detalles */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-teal-700 uppercase tracking-wider font-semibold mb-2">
                {reservation.location}
              </p>
              <h3 className="text-3xl font-light text-gray-900 mb-3">
                {reservation.roomName}
              </h3>
              <p className="text-sm text-gray-500">
                {reservation.size} • {reservation.view} •{" "}
                {reservation.amenities}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Ref:
              </p>
              <p className="text-sm font-mono text-gray-700 font-medium">
                {reservation.refNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Check-in
              </p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                {reservation.checkIn}
              </p>
            </div>
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Check-out
              </p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                {reservation.checkOut}
              </p>
            </div>
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Guests
              </p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                {reservation.guests}{" "}
                {reservation.guests === 1 ? "Adult" : "Adults"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              to={`/reservation/${reservation.id}`}
              className="bg-teal-700 text-white px-8 py-3 rounded hover:bg-teal-800 transition-colors font-medium text-sm tracking-wide uppercase"
            >
              VIEW DETAILS
            </Link>
            {!isPast && (
              <button
                onClick={() => handleCancelStay(reservation.id)}
                className="text-gray-600 px-6 py-3 rounded border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
              >
                <X className="w-4 h-4" />
                Cancel Stay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf0]">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Back Navigation */}
            <Link
              to="/rooms"
              className="flex items-center gap-2 text-gray-600 hover:text-teal-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Rooms & Suites</span>
            </Link>

            {/* Logo */}
            <div className="shrink-0 text-right lg:text-center">
              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] font-bold text-gray-950">
                {BRAND_CONFIG.name}
              </p>
              <p className="text-[clamp(0.65rem,1vw,0.78rem)] tracking-widest text-gray-600">
                {BRAND_CONFIG.tagline}
              </p>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <button className="p-2  rounded-full transition-colors">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <Link
                to="/profile"
                className="flex items-center gap-3  px-3 py-2 rounded-lg transition-colors ml-2"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-gray-200"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Title Section - Alineado a la izquierda */}
        <div className="mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
            GUEST DASHBOARD
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            My Reservations
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}. You have {upcomingReservations.length}{" "}
            upcoming {upcomingReservations.length === 1 ? "stay" : "stays"}.
          </p>
        </div>

        {/* Tabs y Botón New Reservation */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-4 px-1 font-medium text-sm transition-colors relative uppercase tracking-wide ${
                activeTab === "upcoming"
                  ? "text-teal-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming Stays
              {activeTab === "upcoming" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-4 px-1 font-medium text-sm transition-colors relative uppercase tracking-wide ${
                activeTab === "past"
                  ? "text-teal-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Past Visits
              {activeTab === "past" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700"></span>
              )}
            </button>
          </nav>

          <Link
            to="/new-booking"
            className="bg-teal-700 text-white px-6 py-3 rounded hover:bg-teal-800 transition-colors font-medium text-sm tracking-wide uppercase flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Reservation
          </Link>
        </div>

        {/* Reservations List */}
        <div className="space-y-8">
          {activeTab === "upcoming" ? (
            upcomingReservations.length > 0 ? (
              upcomingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-500 mb-6">No upcoming reservations</p>
                <Link
                  to="/rooms"
                  className="inline-block bg-teal-700 text-white px-8 py-3 rounded hover:bg-teal-800 transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Book a Room
                </Link>
              </div>
            )
          ) : pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isPast={true}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <p className="text-gray-500">No past visits</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuestDashboard;
