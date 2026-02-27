import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, X, Moon, ChevronLeft, Plus } from "lucide-react";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Decode JWT payload without a library
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const getToken = () =>
  localStorage.getItem("guest_token") || localStorage.getItem("token");

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const GuestDashboard = () => {
  const [activeTab, setActiveTab]             = useState("upcoming");
  const [reservations, setReservations]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [cancelling, setCancelling]           = useState(null);
  const [guest, setGuest]                     = useState({ name: "", email: "" });

  // Read guest info from JWT — supports guest_token (registered guests) and token (users table guests)
  useEffect(() => {
    const raw     = localStorage.getItem("guest_token") || localStorage.getItem("token");
    const payload = parseJwt(raw);
    if (payload) {
      setGuest({ name: payload.name || "Guest", email: payload.email, id: payload.sub });
    }
  }, []);

  // Fetch reservations for this guest
  useEffect(() => {
    if (!guest.id) return;

    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`${API_URL}/reservations?limit=100`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Could not load reservations.");
        const data = await res.json();

        // Filter only this guest's reservations
        const mine = (data.data || []).filter((r) => r.guest_id === guest.id);
        setReservations(mine);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [guest.id]);

  const handleCancel = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    setCancelling(reservationId);
    try {
      const res = await fetch(`${API_URL}/reservations/${reservationId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Could not cancel reservation.");
      // Update local state
      setReservations((prev) =>
        prev.map((r) => r.id === reservationId ? { ...r, status: "cancelled" } : r)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  // Split reservations into upcoming and past
  const today = new Date().toISOString().split("T")[0];

  const upcoming = reservations.filter(
    (r) => r.check_out_date >= today && r.status !== "cancelled" && r.status !== "checked_out"
  );
  const past = reservations.filter(
    (r) => r.check_out_date < today || r.status === "cancelled" || r.status === "checked_out"
  );

  const statusColors = {
    confirmed:   "bg-emerald-100 text-emerald-800",
    pending:     "bg-amber-100 text-amber-800",
    checked_in:  "bg-blue-100 text-blue-800",
    checked_out: "bg-gray-100 text-gray-600",
    cancelled:   "bg-red-100 text-red-700",
  };

  const ReservationCard = ({ reservation, isPast = false }) => (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex flex-col lg:flex-row">

        {/* Room image placeholder — replace with real image if available */}
        <div className="relative lg:w-[320px] h-64 lg:h-auto flex-shrink-0 bg-slate-100 flex items-center justify-center">
          <span className="text-4xl">🏨</span>
          <span className={`absolute top-4 left-4 px-3 py-1.5 rounded text-xs font-semibold tracking-wide ${statusColors[reservation.status] || "bg-gray-100 text-gray-600"}`}>
            {reservation.status?.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-teal-700 uppercase tracking-wider font-semibold mb-2">
                {reservation.room_type || "Room"}
              </p>
              <h3 className="text-3xl font-light text-gray-900 mb-2">
                {reservation.room_number}
              </h3>
              <p className="text-sm text-gray-500">
                {reservation.adults} adult{reservation.adults !== 1 ? "s" : ""}
                {reservation.children > 0 && ` · ${reservation.children} child${reservation.children !== 1 ? "ren" : ""}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Ref:</p>
              <p className="text-sm font-mono text-gray-700 font-medium">
                LX-{reservation.id?.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ${Number(reservation.total_price || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Dates + guests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Check-in</p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                {formatDate(reservation.check_in_date)}
              </p>
            </div>
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Check-out</p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                {formatDate(reservation.check_out_date)}
              </p>
            </div>
            <div className="border-l-2 border-teal-700 pl-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Guests</p>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                {reservation.adults + (reservation.children || 0)} total
              </p>
            </div>
          </div>

          {/* Special requests */}
          {reservation.special_requests && (
            <p className="text-xs text-gray-500 mb-6 italic">
              📝 {reservation.special_requests}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!isPast && reservation.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(reservation.id)}
                disabled={cancelling === reservation.id}
                className="text-gray-600 px-6 py-3 rounded border border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {cancelling === reservation.id
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <X className="w-4 h-4" />
                }
                Cancel Stay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const firstName = guest.name?.split(" ")[0] || "Guest";
  const avatar    = `https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.email}`;

  return (
    <div className="min-h-screen bg-[#fdfcf0]">

      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">

            <Link to="/rooms" className="flex items-center gap-2 text-gray-600 hover:text-teal-700 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Rooms & Suites</span>
            </Link>

            <div className="shrink-0 text-center">
              <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] font-bold text-gray-950">{BRAND_CONFIG.name}</p>
              <p className="text-[clamp(0.65rem,1vw,0.78rem)] tracking-widest text-gray-600">{BRAND_CONFIG.tagline}</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full transition-colors">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg ml-2">
                <img src={avatar} alt={guest.name} className="w-9 h-9 rounded-full border-2 border-gray-200" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">{firstName}</p>
                  <p className="text-xs text-gray-500">Guest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Title */}
        <div className="mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Guest Dashboard</p>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">My Reservations</h1>
          <p className="text-gray-600">
            Welcome back, {firstName}. You have {upcoming.length} upcoming {upcoming.length === 1 ? "stay" : "stays"}.
          </p>
        </div>

        {/* Tabs + New Reservation */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { key: "upcoming", label: "Upcoming Stays", count: upcoming.length },
              { key: "past",     label: "Past Visits",    count: past.length     },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 px-1 font-medium text-sm transition-colors relative uppercase tracking-wide ${
                  activeTab === key ? "text-teal-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700">{count}</span>
                )}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700" />
                )}
              </button>
            ))}
          </nav>

          <Link
            to="/rooms"
            className="bg-teal-700 text-white px-6 py-3 rounded hover:bg-teal-800 transition-colors font-medium text-sm tracking-wide uppercase flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Reservation
          </Link>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-white rounded-lg border border-red-100">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Please try refreshing the page.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {(activeTab === "upcoming" ? upcoming : past).length > 0
              ? (activeTab === "upcoming" ? upcoming : past).map((r) => (
                  <ReservationCard key={r.id} reservation={r} isPast={activeTab === "past"} />
                ))
              : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-500 mb-6">
                    {activeTab === "upcoming" ? "No upcoming reservations" : "No past visits"}
                  </p>
                  {activeTab === "upcoming" && (
                    <Link
                      to="/rooms"
                      className="inline-block bg-teal-700 text-white px-8 py-3 rounded hover:bg-teal-800 transition-colors uppercase tracking-wide text-sm font-medium"
                    >
                      Book a Room
                    </Link>
                  )}
                </div>
              )
            }
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestDashboard;
