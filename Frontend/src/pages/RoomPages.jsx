import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/room/RoomCard";
import { useRooms } from "../context/RoomContext";  // ← Importar
import { ChevronLeft, Filter, X } from "lucide-react";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";

const RoomPages = () => {
  const [selectedView, setSelectedView] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy] = useState("featured");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { rooms, loading, error } = useRooms();  // ← Obtener del contexto

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-teal-700">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Error: {error}</p>
          <p className="text-gray-600 mt-2">Please refresh the page</p>
        </div>
      </div>
    );
  }

  // Filtrar habitaciones
  const filteredRooms = rooms.filter((room) => {
    const viewMatch =
      selectedView === "all" ||
      room.view?.toLowerCase() === selectedView.toLowerCase();
    let priceMatch = true;

    if (priceRange === "budget") priceMatch = room.price < 200;
    if (priceRange === "mid")
      priceMatch = room.price >= 200 && room.price < 300;
    if (priceRange === "luxury") priceMatch = room.price >= 300;

    return viewMatch && priceMatch;
  });

  // Ordenar habitaciones
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#fdfcf0] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14">
      <div>
        {/* Header */}
        <div className="bg-[#fdfcf0] relative flex flex-row items-start justify-between gap-3 sm:gap-4 px-2 sm:px-4 py-2 sm:py-4">
          <button
            onClick={() => navigate("/#rooms")}
            className="group relative pb-1 text-[#2C5F5D] font-semibold tracking-wider transition-all duration-300 hover:text-[#C9A961] flex items-center gap-2 text-[clamp(0.8rem,2.2vw,1rem)]"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Rooms & Suites</span>
          </button>

          <div className="hidden lg:block text-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 max-w-3xl mx-auto px-2">
            <h1 className="font-bold text-slate-900 mb-2 text-[clamp(1.8rem,4.6vw,3rem)]">
              Our <span className="font-semibold">Sanctuary</span>
            </h1>
            <p className="text-slate-500 text-[clamp(0.95rem,2.3vw,1.2rem)] leading-relaxed">
              Experience refined luxury in our curated selection of rooms and
              suites, designed for peace and timeless comfort.
            </p>
          </div>

          {/* Brand Info */}
          <div className="flex flex-col items-end lg:items-center mt-0 text-right lg:text-center shrink-0">
            <h1 className="font-bold text-gray-950 text-[clamp(0.9rem,1.5vw,1.1rem)]">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-gray-500 tracking-widest text-[clamp(0.65rem,1vw,0.78rem)]">
              {BRAND_CONFIG.tagline}
            </p>
          </div>
        </div>

        <div className="lg:hidden text-center max-w-3xl mx-auto px-2 mt-3">
          <h1 className="font-bold text-slate-900 mb-2 text-[clamp(1.8rem,4.6vw,3rem)]">
            Our <span className="font-semibold">Sanctuary</span>
          </h1>
          <p className="text-slate-500 text-[clamp(0.95rem,2.3vw,1.2rem)] leading-relaxed">
            Experience refined luxury in our curated selection of rooms and
            suites, designed for peace and timeless comfort.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm mt-6 sm:mt-8 flex items-center max-w-7xl px-3 sm:px-4 mx-auto rounded-lg">
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
              <div className="lg:hidden mt-3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedView("all")}
                    className={`px-4 py-2.5 rounded-lg transition font-semibold text-[clamp(0.8rem,2vw,0.95rem)] ${
                      selectedView === "all"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Views
                  </button>
                  <button
                    onClick={() => setSelectedView("city")}
                    className={`px-4 py-2.5 rounded-lg font-medium transition text-[clamp(0.8rem,2vw,0.95rem)] ${
                      selectedView === "city"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    City View
                  </button>
                  <button
                    onClick={() => setSelectedView("garden")}
                    className={`px-4 py-2.5 rounded-lg font-medium transition text-[clamp(0.8rem,2vw,0.95rem)] ${
                      selectedView === "garden"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Garden View
                  </button>
                  <button
                    onClick={() => setSelectedView("panoramic")}
                    className={`px-4 py-2.5 rounded-lg font-medium transition text-[clamp(0.8rem,2vw,0.95rem)] ${
                      selectedView === "panoramic"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Panoramic View
                  </button>
                </div>

                <select
                  name="priceRange"
                  aria-label="Filter by price range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border bg-white border-gray-300 font-semibold text-[clamp(0.8rem,2vw,0.95rem)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Under $200</option>
                  <option value="mid">$200 - $300</option>
                  <option value="luxury">$300+</option>
                </select>
              </div>
            )}

            <div className="hidden lg:flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedView("all")}
                  className={`px-4 py-2 rounded-lg transition font-semibold text-[clamp(0.8rem,1.2vw,0.95rem)] ${
                    selectedView === "all"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Views
                </button>
                <button
                  onClick={() => setSelectedView("city")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-[clamp(0.8rem,1.2vw,0.95rem)] ${
                    selectedView === "city"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  City View
                </button>
                <button
                  onClick={() => setSelectedView("garden")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-[clamp(0.8rem,1.2vw,0.95rem)] ${
                    selectedView === "garden"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Garden View
                </button>
                <button
                  onClick={() => setSelectedView("panoramic")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-[clamp(0.8rem,1.2vw,0.95rem)] ${
                    selectedView === "panoramic"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Panoramic View
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  name="priceRange"
                  aria-label="Filter by price range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-2 rounded-lg border bg-white border-gray-300 font-semibold text-[clamp(0.8rem,1.1vw,0.95rem)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Under $200</option>
                  <option value="mid">$200 - $300</option>
                  <option value="luxury">$300+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-600 text-[clamp(0.85rem,2vw,1rem)]">
            Showing <span className="font-semibold">{sortedRooms.length}</span>{" "}
            room{sortedRooms.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="max-w-8xl mx-auto px-4 pb-16 -mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {sortedRooms.map((room) => (
              <RoomCard key={room.uuid} room={room} variant="default" />
            ))}
          </div>

          {/* No results */}
          {sortedRooms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4 text-[clamp(0.95rem,2.3vw,1.2rem)]">
                No rooms found matching your filters
              </p>
              <button
                onClick={() => {
                  setSelectedView("all");
                  setPriceRange("all");
                }}
                className="text-teal-600 hover:text-teal-700 font-semibold text-[clamp(0.85rem,2vw,1rem)]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPages;