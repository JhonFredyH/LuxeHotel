import { useParams, useNavigate } from "react-router-dom";
import { useRooms } from "../context/RoomContext";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";
import { useState } from "react";
import { Users, Maximize2, Eye, ShieldCheck, ChevronLeft } from "lucide-react";
import { roomAmenities } from "../data/roomAmenities";
import RoomSlider from "../components/RoomSlider";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomBySlug, loading } = useRooms();
  const room = getRoomBySlug(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    children: 0,
  });

  const [errors, setErrors] = useState({});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-teal-700">
            Loading room details...
          </p>
        </div>
      </div>
    );
  }

  const roomImages =
    room?.images && room.images.length > 0
      ? room.images
      : room?.image
        ? [room.image]
        : [];

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    } else if (new Date(formData.checkIn) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.checkIn = "Check-in cannot be in the past";
    }

    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    } else if (
      formData.checkIn &&
      new Date(formData.checkOut) <= new Date(formData.checkIn)
    ) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    return newErrors;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      navigate("/reservation-view", {
        state: {
          reservationData: formData,
          room,
        },
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const diff = new Date(formData.checkOut) - new Date(formData.checkIn);
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 1;
  };

  const nights = calculateNights();

  {
    /*room does not exist*/
  }
  if (!room) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center max-w-md">
          <h1 className="font-light text-gray-900 mb-4 text-[clamp(2rem,8vw,2.5rem)]">
            Room <span className="font-semibold">Not Found</span>
          </h1>
          <p className="text-gray-600 mb-8 text-[clamp(1rem,3vw,1.125rem)]">
            The room you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/#rooms")}
            className="px-6 sm:px-8 py-3 bg-[#5a8a95] text-white uppercase tracking-wider font-medium rounded-lg hover:bg-[#4a7885] transition-colors text-[clamp(0.82rem,2vw,0.95rem)]"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf0]">
      {/* Header */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6">
        <div className="flex flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 sm:gap-2 text-gray-500 text-[clamp(0.75rem,2vw,1rem)] min-w-0">
            <button
              onClick={() => navigate("/#rooms")}
              className="flex items-center gap-1 sm:gap-2 hover:text-gray-900 transition-colors group"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
              <span>Rooms & Suites</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{room.name}</span>
          </nav>

          {/* Brand Info */}
          <div className="flex flex-col items-end lg:items-center mt-0 text-right lg:text-center shrink-0">
            <h2 className="font-bold text-gray-950 text-[clamp(1rem,3vw,1.125rem)]">
              {BRAND_CONFIG.name}
            </h2>
            <p className="text-gray-500 tracking-widest text-[clamp(0.65rem,2vw,0.75rem)]">
              {BRAND_CONFIG.tagline}
            </p>
          </div>
        </div>

        {/* Room Title */}
        <div className="-mt-8 sm:-mt-10 ml-2 sm:ml-4 md:ml-6">
          <h1 className="font-light text-gray-900 leading-tight text-[clamp(2rem,6vw,3rem)]">
            {room.name}
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-4xl mt-2 sm:mt-3 text-[clamp(1rem,2.5vw,1.25rem)]">
            {room.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">
            {/* Hero Image */}
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] overflow-hidden rounded-lg shadow-xl">
              <RoomSlider images={roomImages} price={room.price} />
            </div>

            {/* Description */}
            <div>
              <h2 className="font-light text-gray-900 mb-4 sm:mb-6 text-[clamp(1.75rem,5vw,2.5rem)]">
                About This <span className="font-semibold">Suite</span>
              </h2>
              <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-justify text-[clamp(1rem,2vw,1.125rem)]">
                <p>{room.shortDescription}</p>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 pb-6 sm:pb-8 border-b">
              <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#5a8a95]">
                <Maximize2 className="text-[#5a8a95] flex-shrink-0" size={24} />
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-[clamp(0.65rem,1.5vw,0.78rem)]">
                    Size
                  </p>
                  <p className="font-semibold text-gray-900 text-[clamp(1rem,2vw,1.125rem)]">
                    {room.size}m²
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#5a8a95]">
                <Eye className="text-[#5a8a95] flex-shrink-0" size={24} />
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-[clamp(0.65rem,1.5vw,0.78rem)]">
                    View
                  </p>
                  <p className="font-semibold text-gray-900 text-[clamp(1rem,2vw,1.125rem)]">
                    {room.view}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#5a8a95]">
                <Users className="text-[#5a8a95] flex-shrink-0" size={24} />
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-[clamp(0.65rem,1.5vw,0.78rem)]">
                    Capacity
                  </p>
                  <p className="font-semibold text-gray-900 text-[clamp(1rem,2vw,1.125rem)]">
                    {room.capacity.maxGuests} Guests
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-light text-gray-900 mb-4 sm:mb-6 text-[clamp(1.75rem,5vw,2.5rem)]">
                Room <span className="font-semibold">Amenities</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                {room.amenities.map((key) => {
                  const amenity = roomAmenities[key];
                  if (!amenity) return null;
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <Icon
                        className="text-[#5a8a95] flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-700 font-medium text-[clamp(0.875rem,2vw,1rem)]">
                        {amenity.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:sticky lg:top-24"
            >
              <h3 className="font-semibold text-gray-900 mb-4 sm:mb-6 text-[clamp(1.25rem,3vw,1.5rem)]">
                Book Your Stay
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Check-in / Check-out */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative min-h-[65px]">
                    <label
                      htmlFor="checkIn"
                      className="absolute -top-2.5 left-1 text-gray-500 uppercase tracking-wider pointer-events-none text-[clamp(0.65rem,1.5vw,0.78rem)]"
                    >
                      Check-In
                    </label>
                    <input
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`peer w-full border-b-2 bg-transparent py-2.5 sm:py-3 px-1 outline-none transition-all ${
                        errors.checkIn
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#5a8a95]"
                      }`}
                    />
                    {errors.checkIn && (
                      <p className="mt-1 text-red-500 text-[clamp(0.65rem,1.5vw,0.78rem)]">
                        {errors.checkIn}
                      </p>
                    )}
                  </div>

                  <div className="relative min-h-[65px]">
                    <label
                      htmlFor="checkOut"
                      className="absolute -top-2.5 left-1 text-gray-500 uppercase tracking-wider pointer-events-none text-[clamp(0.65rem,1.5vw,0.78rem)]"
                    >
                      Check-Out
                    </label>
                    <input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={
                        formData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      className={`peer w-full border-b-2 bg-transparent py-2.5 sm:py-3 px-1 outline-none transition-all ${
                        errors.checkOut
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#5a8a95]"
                      }`}
                    />
                    {errors.checkOut && (
                      <p className="mt-1 text-red-500 text-[clamp(0.65rem,1.5vw,0.78rem)]">
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                </div>

                {/* Guests / Children */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative min-h-[65px]">
                    <label
                      htmlFor="guests"
                      className="absolute -top-2.5 left-1 text-gray-500 uppercase tracking-wider pointer-events-none text-[clamp(0.65rem,1.5vw,0.78rem)]"
                    >
                      Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="peer w-full border-b-2 bg-transparent py-2.5 sm:py-3 px-1 outline-none transition-all border-gray-300 focus:border-[#5a8a95] appearance-none cursor-pointer"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                  </div>

                  <div className="relative min-h-[65px]">
                    <label
                      htmlFor="children"
                      className="absolute -top-2.5 left-1 text-gray-500 uppercase tracking-wider pointer-events-none text-[clamp(0.65rem,1.5vw,0.78rem)]"
                    >
                      Children
                    </label>
                    <select
                      id="children"
                      name="children"
                      value={formData.children}
                      onChange={handleChange}
                      className="peer w-full border-b-2 bg-transparent py-2.5 sm:py-3 px-1 outline-none transition-all border-gray-300 focus:border-[#5a8a95] appearance-none cursor-pointer"
                    >
                      <option value={0}>0 Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                      <option value={3}>3 Children</option>
                      <option value={4}>4 Children</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 sm:pt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-[clamp(0.875rem,2vw,1rem)]">
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-semibold text-gray-900 text-[clamp(1rem,2vw,1.125rem)]">
                      ${room.price * nights}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-[clamp(0.875rem,2vw,1rem)]">
                      Service fee
                    </span>
                    <span className="font-semibold text-gray-900 text-[clamp(1rem,2vw,1.125rem)]">
                      $50
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t pt-3 sm:pt-4 mt-3 sm:mt-4 text-[clamp(1.125rem,2.5vw,1.25rem)]">
                    <span>Total</span>
                    <span className="text-[#5a8a95]">
                      ${room.price * nights + 50}
                    </span>
                  </div>
                </div>

                {/* Reserve Button */}
                <button
                  type="submit"
                  className="w-full py-3 sm:py-4 bg-[#5a8a95] hover:bg-[#4a7885] disabled:bg-gray-300 disabled:cursor-not-allowed text-white uppercase tracking-wider font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-[clamp(0.875rem,2vw,1rem)]"
                >
                  Reserve Now
                </button>

                {/* Cancellation Policy */}
                <div className="flex items-start gap-2 sm:gap-3 text-gray-500 bg-[#f9fafb] p-3 sm:p-4 rounded-lg">
                  <ShieldCheck
                    size={20}
                    className="text-[#5a8a95] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-bold text-gray-700 mb-1 text-[clamp(0.875rem,2vw,1rem)]">
                      Cancellation Policy
                    </h4>
                    <p className="text-gray-500 text-[clamp(0.75rem,1.8vw,0.875rem)]">
                      Free cancellation for 12 hours. After that, cancel before
                      check-in for a partial refund.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-16 sm:h-20"></div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
