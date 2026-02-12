import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAmenityIcon, getAmenityLabel } from "../../data/AmenitiesIcons";

const RoomCard = ({ room, variant = "premium", nights = 3, reservationData }) => {
  const {
    name,
    price,
    image,
    view,
    amenities,
    id,
    size,
    rating,
    reviews,
    capacity,
  } = room;
  const coverImage = room.images?.[0] || image;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  {
    /* Desktop - Grid 3 columnas con iconos de Lucide */
  }
  const renderAmenitiesDesktop = () => {
    const displayAmenities = amenities.slice(0, 6);

    return (
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-2">
          {displayAmenities.map((amenity, index) => {
            const IconComponent = getAmenityIcon(amenity);
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 hover:shadow-sm transition-shadow"
              >
                <IconComponent className="w-5 h-5 text-teal-600" />
                <span className="text-xs text-gray-700 font-medium text-center leading-tight">
                  {getAmenityLabel(amenity)}
                </span>
              </div>
            );
          })}
        </div>

        {amenities.length > 6 && (
          <p className="text-xs text-gray-500 italic text-center mt-2">
            + {amenities.length - 6} more{" "}
            {amenities.length - 6 === 1 ? "amenity" : "amenities"} available
          </p>
        )}
      </div>
    );
  };

  {
    /* Tablet - Dropdown */
  }
  const renderAmenitiesDropdown = () => (
    <div className="hidden md:block lg:hidden relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg border-2 border-teal-200 bg-white hover:bg-teal-50 transition-colors flex items-center justify-between gap-3 font-medium text-gray-700"
      >
        <span className="text-sm">View amenities ({amenities.length})</span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />

          <div className="absolute top-full mt-3 left-0 md:left-auto md:right-0 min-w-[320px] bg-white rounded-xl shadow-2xl border-2 border-teal-100 z-[9999]">
            <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
              <h4 className="font-semibold text-gray-900 text-sm">
                All amenities
              </h4>
            </div>
            <div className="p-3 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {amenities.map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">
                        {getAmenityLabel(amenity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  {
    /* Mobile - Modal */
  }
  const renderAmenitiesModal = () => (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden w-full px-4 py-3 rounded-lg border-2 border-teal-200 bg-white active:bg-teal-50 transition-colors flex items-center justify-between font-medium text-gray-700"
      >
        <span className="text-sm">View amenities ({amenities.length})</span>
        <svg
          className="w-5 h-5 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-white rounded-t-3xl shadow-2xl animate-slideUp max-h-[80vh] flex flex-col w-[calc(100%-1rem)] max-w-md">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />

            <div className="px-6 pb-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                All amenities
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 gap-3 pb-6">
                {amenities.map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100"
                    >
                      <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">
                        {getAmenityLabel(amenity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-teal-600 text-white font-semibold py-4 rounded-xl hover:bg-teal-700 active:scale-98 transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  // Variante Premium
  if (variant === "premium") {
    return (
      <div className="flex flex-col bg-[#ffffff] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
        <div className="relative overflow-hidden">
          <img
            src={coverImage}
            alt={room.alt}
            className="w-full h-[300px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(44,95,93,0.15)] via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"></div>

          <div
            className="absolute top-5 right-5 px-5 py-2.5 rounded-[28px] font-semibold text-[13px] tracking-wide backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-10 transition-all duration-300 bg-[rgba(44,95,93,0.95)] text-white group-hover:scale-105"
            aria-label={`Starting from $${price} per night`}
          >
            <span className="text-[11px] opacity-90">FROM</span> ${price}{" "}
            <span className="text-[11px] opacity-90">/ NIGHT</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl text-gray-900 mb-2 font-bold">{name}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-6 text-center font-semibold">
            {size}M² • {view} • {amenities[0]}
          </p>

          <button
            onClick={() => navigate(`/rooms/${id}`)}
            className="mt-auto w-full py-3 border-2 border-[#2C5F5D] bg-transparent text-[#2C5F5D] font-bold uppercase tracking-wider rounded relative overflow-hidden transition-all duration-300 hover:text-white hover:border-[#C9A961] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(201,169,97,0.3)] group/btn"
          >
            <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover/btn:w-full"></span>
            <span className="relative z-10">View Details</span>
          </button>
        </div>
      </div>
    );
  }

  {
    /* Variante Compare */
  }
  if (variant === "compare") {
    return (
      <div className="bg-white rounded-xl overflow-visible shadow-lg hover:shadow-xl transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-4 lg:col-span-3">
            <img
              src={coverImage}
              alt={name}
              className="w-full h-64 md:h-[350px] object-cover md:rounded-l-xl"
            />
          </div>

          {/* Header */}
          <div className="md:col-span-5 lg:col-span-6 p-5 lg:p-6 flex flex-col justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-[clamp(1rem,2.5vw,1.5rem)]">
                {name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3 text-lg">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500 text-sm">({reviews})</span>
                </div>

                <span className="hidden lg:inline text-gray-300">|</span>

                {/* Size */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">Size:</span>
                  <span className="font-semibold text-gray-900">{size}m²</span>
                </div>

                <span className="hidden lg:inline text-gray-300">|</span>

                {/* View */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">View:</span>
                  <span className="font-semibold text-gray-900">{view}</span>
                </div>

                <span className="hidden lg:inline text-gray-300">|</span>

                {/* Max guests */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">Max:</span>
                  <span className="font-semibold text-gray-900">
                    {capacity.maxGuests}
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities - Responsive según dispositivo */}
            <div className="mt-2">
              {renderAmenitiesDesktop()}
              {renderAmenitiesDropdown()}
              {renderAmenitiesModal()}
            </div>
          </div>

          {/* Price */}
          <div className="md:col-span-3 bg-gradient-to-br from-teal-50 to-emerald-50 p-5 lg:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l-2 border-teal-100">
            <div>
              <p className="uppercase tracking-wide mb-1 font-semibold text-teal-700 text-xs">
                Per night
              </p>
              <p className="font-bold text-teal-700 mb-4 text-4xl">${price}</p>

              <div className="bg-white/60 rounded-lg p-3 mb-4 border border-teal-200">
                <p className="text-gray-600 mb-1 text-sm">
                  Total for {nights} {nights === 1 ? "night" : "nights"}
                </p>
                <p className="font-bold text-gray-900 text-xl">
                  ${price * nights}
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() =>
                  navigate("/reservation-view", {
                    state: {
                      room,
                      reservationData,
                    },
                  })
                }
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg text-sm hover:bg-teal-700 active:scale-95 transition-all shadow-md hover:shadow-lg mb-3"
              >
                Select Room
              </button>

              <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-xs">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free Cancellation
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }

          .animate-slideUp {
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .active\\:scale-98:active {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    );
  }

  // Variante por defecto
  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 h-full">
      <div className="relative h-[280px] overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div
          className="absolute top-5 right-5 px-5 py-2.5 rounded-[28px] font-semibold text-[13px] tracking-wide backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-10 transition-all duration-300 bg-[rgba(44,95,93,0.95)] text-white group-hover:scale-105"
          aria-label={`Starting from $${price} per night`}
        >
          <span className="text-[11px] opacity-90">FROM</span> ${price}{" "}
          <span className="text-[11px] opacity-90">/ NIGHT</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl text-gray-900 mb-2 font-bold">{name}</h3>
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-6 text-center">
          {size}M² • {view} • {amenities[0]}
        </p>

        <button
          onClick={() => navigate(`/rooms/${id}`)}
          className="mt-auto w-full py-3 border-2 border-[#2C5F5D] bg-transparent text-[#2C5F5D] font-bold uppercase tracking-wider rounded relative overflow-hidden transition-all duration-300 hover:text-white hover:border-[#C9A961] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(201,169,97,0.3)] group/btn"
        >
          <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover/btn:w-full"></span>
          <span className="relative z-10">View Details</span>
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
