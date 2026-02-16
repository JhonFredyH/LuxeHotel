import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useRooms } from "../context/RoomContext";
import RoomCard from "../components/room/RoomCard";
import { ChevronLeft, Filter, X } from "lucide-react";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";

const CheckRates = () => {
  const [params] = useSearchParams();
  const [sortBy, setSortBy] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const { rooms, loading } = useRooms();

  const parsedCheckIn = params.get("checkIn");
  const parsedCheckOut = params.get("checkOut");
  const oneDayMs = 24 * 60 * 60 * 1000;
  const checkIn = parsedCheckIn ? new Date(parsedCheckIn) : new Date();
  const checkOut = parsedCheckOut
    ? new Date(parsedCheckOut)
    : new Date(new Date().getTime() + oneDayMs);
  const adults = Number(params.get("adults")) || 1;
  const children = Number(params.get("children")) || 0;
  const reservationData = {
    checkIn: parsedCheckIn || "",
    checkOut: parsedCheckOut || "",
    guests: adults,
    children,
  };

  const nights = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const availableRooms = rooms.filter(
    (room) => room.capacity.maxGuests >= adults + children,
  );

  const sortedRooms = useMemo(() => {
    const roomsList = [...availableRooms];
    if (sortBy === "price") {
      return roomsList.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "rating") {
      return roomsList.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "size") {
      return roomsList.sort((a, b) => b.size - a.size);
    }
    return roomsList;
  }, [availableRooms, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-teal-700">
            Loading available rooms...
          </p>
        </div>
      </div>
    );
  }

  const onBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-[#fdfcf0] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14">
      {/* Header */}
      <div className="bg-[#fdfcf0] relative flex items-start justify-between gap-3 sm:gap-4 px-2 sm:px-4 py-2 sm:py-4">
        <button
          onClick={onBack}
          className="group relative pb-1 text-[#2C5F5D] font-semibold tracking-wider transition-all duration-300 hover:text-[#C9A961] flex items-center gap-2 text-[clamp(0.8rem,2.2vw,1rem)]"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Check Rates</span>
        </button>
        
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-3xl px-2">
          <h1 className="font-bold text-slate-900 mb-2 text-[clamp(1.8rem,4.6vw,3rem)]">
            Compare Prices
          </h1>
          <p className="text-slate-500 text-[clamp(0.95rem,2.3vw,1.2rem)]">
            Find the perfect room for your stay
          </p>
        </div>

        <div className="flex flex-col items-end lg:items-center mt-0 text-right lg:text-center shrink-0">
          <p className="font-bold text-gray-950 text-[clamp(0.9rem,1.5vw,1.1rem)]">
            {BRAND_CONFIG.name}
          </p>
          <p className="text-gray-500 tracking-widest text-[clamp(0.65rem,1vw,0.78rem)]">
            {BRAND_CONFIG.tagline}
          </p>
        </div>
      </div>      
      <div className="lg:hidden text-center max-w-3xl mx-auto px-2 mt-3">
        <h1 className="font-bold text-slate-900 mb-2 text-[clamp(1.8rem,4.6vw,3rem)]">
          Compare Prices
        </h1>
        <p className="text-slate-500 text-[clamp(0.95rem,2.3vw,1.2rem)]">
          Find the perfect room for your stay
        </p>
      </div>

      {/* MOBILE/TABLET: Booking Info separada */}
      <div className="lg:hidden bg-teal-50 border border-teal-200 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto mt-6">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[clamp(0.8rem,2vw,1rem)]">
          <div className="flex items-center gap-2 bg-emerald-700 text-white px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
            <span className="font-semibold">Status:</span>
            <span className="font-medium">Open</span>
          </div>

          <div className="flex items-center gap-2 bg-teal-700 text-white px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
            <span className="text-[clamp(0.9rem,2vw,1.1rem)] font-bold">
              {nights}
            </span>
            <span className="text-[clamp(0.75rem,1.8vw,0.9rem)] font-medium">
              {nights === 1 ? "night" : "nights"}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold text-teal-800">Guests:</span>
            <span className="text-slate-700">{adults + children}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP: Card unificada con info + filtros */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-200 max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Info de reserva */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Available
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-teal-700">
                  {nights}
                </span>
                <span className="text-sm text-gray-600">
                  {nights === 1 ? "night" : "nights"}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {adults + children} guests
                </span>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 mr-2">
                SORT BY:
              </span>
              {[
                { id: "all", label: "All" },
                { id: "price", label: "Price" },
                { id: "rating", label: "Rating" },
                { id: "size", label: "Size" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option.id
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE/TABLET: Filtros separados - MANTENER IGUAL */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-10 shadow-sm mt-6 sm:mt-8 flex items-center w-full max-w-md sm:max-w-7xl px-3 sm:px-4 mx-auto rounded-lg">
        <div className="max-w-8xl mx-auto py-3 sm:py-4 w-full">
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-[#f8faf9] text-gray-800 font-semibold text-[clamp(0.85rem,2.2vw,1rem)]"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </span>
              {isFilterMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <span className="text-[clamp(0.75rem,1.8vw,0.88rem)] text-gray-500">
                  Open
                </span>
              )}
            </button>
          </div>

          {isFilterMenuOpen && (
            <div className="lg:hidden mt-3 max-w-sm mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "all", label: "All" },
                { id: "price", label: "Lower Price" },
                { id: "rating", label: "Best Rated" },
                { id: "size", label: "Most Spacious" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-4 py-2.5 rounded-lg transition font-semibold text-[clamp(0.8rem,2vw,0.95rem)] ${
                    sortBy === option.id
                      ? "bg-teal-700 text-white border border-teal-700"
                      : "bg-white border border-teal-300 text-teal-800 hover:bg-teal-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Room List */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-7xl mx-auto mt-6">
        {sortedRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            variant="compare"
            nights={nights}
            reservationData={reservationData}
          />
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 sm:mt-10 md:mt-12 rounded-lg border border-teal-300 bg-teal-50 p-4 sm:p-5 md:p-6 text-center max-w-7xl mx-auto">
        <p className="text-teal-900 font-medium text-[clamp(0.78rem,1.9vw,1rem)]">
          💡 <span className="font-semibold">Best price guaranteed</span> – If
          you find a lower price elsewhere, we'll match it + 10% off
        </p>
      </div>
    </div>
  );
};

export default CheckRates;
