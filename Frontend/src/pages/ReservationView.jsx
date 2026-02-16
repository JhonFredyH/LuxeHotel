import React, { useMemo, useState, useEffect } from "react";
import {
  CreditCard,
  Wallet,
  Shield,
  DollarSign,
  User,
  Lock,
} from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { BRAND_CONFIG } from "../components/navbar/navbarConfig";
import { useReservationForm } from "../components/utils/useReservationForm";
import { validateField } from "../components/utils/formValidation";
import { useRooms } from "../context/RoomContext";
import { createGuestBooking } from "../services/reservationService";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDateOnly = (dateValue) => {
  if (!dateValue) return "";
  const normalizedDate =
    typeof dateValue === "string" ? dateValue.slice(0, 10) : dateValue;
  const parsedDate = new Date(
    typeof normalizedDate === "string"
      ? `${normalizedDate}T00:00:00`
      : normalizedDate,
  );
  if (Number.isNaN(parsedDate.getTime())) return String(dateValue);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

// Función para convertir fecha a formato ISO sin zona horaria
const formatDateForBackend = (dateValue) => {
  if (!dateValue) return "";
  const normalizedDate =
    typeof dateValue === "string" ? dateValue.slice(0, 10) : dateValue;
  return `${normalizedDate}T00:00:00`;
};

const ReservationView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, loading } = useRooms();
  
  const bookingState = location.state ?? {};
  
  // Obtener la habitación desde el estado o buscarla en la BD
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formKey, setFormKey] = useState(0); // Key para forzar re-render del formulario
  
  useEffect(() => {
    // Si viene del estado de navegación
    if (bookingState.room) {
      setSelectedRoom(bookingState.room);
    } 
    // Si no hay room en el estado pero hay rooms cargadas, usar la primera
    else if (rooms && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [bookingState.room, rooms]);

  const selectedRoomCover = selectedRoom?.images?.[0] || selectedRoom?.image;
  const reservationData = bookingState.reservationData ?? {};

  const {
    formData,
    errors,
    paymentMethod,
    handleInputChange,
    handlePaymentMethodChange,
    handleSubmit,
    validateFieldOnBlur,
    resetForm, // Intentar obtener resetForm del hook
  } = useReservationForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredFields = useMemo(() => {
    const guestFields = ["fullName", "email", "phone"];
    return paymentMethod === "card"
      ? [...guestFields, "cardholderName", "cardNumber", "expiry", "cvc"]
      : guestFields;
  }, [paymentMethod]);

  const completionPercent = useMemo(() => {
    const validCount = requiredFields.filter(
      (field) => !validateField(field, formData[field]),
    ).length;
    const basePercent = 75; // Comienza en 75%
    const remainingPercent = 25; // Los últimos 25% se completan con el formulario
    const formProgress = (validCount / requiredFields.length) * remainingPercent;
    return Math.round(basePercent + formProgress);
  }, [formData, requiredFields]);

  const nights = useMemo(() => {
    if (!reservationData.checkIn || !reservationData.checkOut) return 1;
    const diff =
      new Date(reservationData.checkOut) - new Date(reservationData.checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [reservationData.checkIn, reservationData.checkOut]);

  const nightlyRate = selectedRoom?.price ?? 0;
  const serviceFee = 50;
  const taxes = Math.round(nightlyRate * nights * 0.1);
  const totalPrice = nightlyRate * nights + serviceFee + taxes;

  const formattedDates =
    reservationData.checkIn && reservationData.checkOut
      ? `${formatDateOnly(reservationData.checkIn)} - ${formatDateOnly(reservationData.checkOut)}`
      : "Select dates in check rates";

  const adults = Number(reservationData.guests || 1);
  const children = Number(reservationData.children || 0);

  // Función para limpiar el formulario
  const clearForm = () => {
    if (typeof resetForm === 'function') {
      // Si el hook tiene resetForm, usarlo
      resetForm();
    } else {
      // Si no existe, forzar re-render del formulario cambiando el key
      setFormKey(prev => prev + 1);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Validar que las fechas existan
      if (!reservationData.checkIn || !reservationData.checkOut) {
        alert("Please select check-in and check-out dates");
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para el backend con formato correcto de fechas
      const bookingData = {
        roomId: selectedRoom?.id,
        checkInDate: formatDateForBackend(reservationData.checkIn),
        checkOutDate: formatDateForBackend(reservationData.checkOut),
        adults: adults,
        children: children,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        specialRequests: data.specialRequests || "",
      };

      console.log("Sending booking data:", bookingData);

      // Llamar al backend
      const result = await createGuestBooking(bookingData);

      if (result.success) {
        console.log("Booking confirmed:", result.data);

        // Mostrar mensaje de éxito
        alert(`Booking confirmed! 
Reference: ${result.data.reference_number}
Total: $${result.data.total_amount}
Check your email for confirmation.`);
        
        // Limpiar el formulario después de la confirmación exitosa
        clearForm();
        
        // Opcional: Navegar a una página de confirmación
        // navigate("/booking-confirmation", { state: { booking: result.data } });
      } else {
        console.error("Booking failed:", result.error);
        const errorMsg = Array.isArray(result.error)
          ? result.error.map((e) => e.msg || e).join("\n")
          : JSON.stringify(result.error);

        alert(`Booking failed:\n${errorMsg}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras se cargan las habitaciones
  if (loading || !selectedRoom) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-teal-700">
            Loading reservation details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfcf0] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1500px]">
        <header className="relative flex items-start justify-between gap-4 px-2 py-2 sm:px-4 sm:py-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="group flex items-center gap-2 rounded-sm pb-1 text-[clamp(0.8rem,2.2vw,1rem)] font-semibold tracking-wider text-[#1f4f56] transition-all duration-300 hover:text-[#a67f24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            <ChevronLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>Check Rates</span>
          </button>

          <div className="hidden lg:block absolute left-1/2 top-1/2 max-w-3xl -translate-x-1/2 -translate-y-1/2 px-2 text-center">
            <h1
              id="reservation-title"
              className="mb-2 text-[clamp(1.8rem,4.6vw,3rem)] font-bold text-slate-900"
            >
              Complete Your Reservation
            </h1>
            <p className="text-[clamp(0.95rem,2.3vw,1.2rem)] text-slate-700">
              Final step: Secure your stay at our{" "}
              <span className="font-semibold">{selectedRoom.name}</span>.
            </p>
          </div>

          <div className="shrink-0 text-right lg:text-center">
            <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] font-bold text-gray-950">
              {BRAND_CONFIG.name}
            </p>
            <p className="text-[clamp(0.65rem,1vw,0.78rem)] tracking-widest text-gray-600">
              {BRAND_CONFIG.tagline}
            </p>
          </div>
        </header>

        <div className="mt-3 px-2 text-center lg:hidden">
          <h1 className="mb-2 text-[clamp(1.8rem,4.6vw,3rem)] font-bold text-slate-900">
            Complete Your Reservation
          </h1>
          <p className="text-[clamp(0.95rem,2.3vw,1.2rem)] text-slate-700">
            Final step: Secure your stay at our{" "}
            <span className="font-semibold">{selectedRoom.name}</span>.
          </p>
        </div>

        <form
          key={formKey} // Key para forzar re-render cuando cambie
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Reservation form"
          className="mt-6 grid grid-cols-1 gap-6 px-0 sm:px-2 lg:grid-cols-2 lg:px-4"
        >
          {/* LEFT COLUMN - GUEST INFO & PAYMENT */}
          <section className="space-y-8">
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded bg-slate-700"
                  aria-hidden="true"
                >
                  <User className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-[clamp(1.05rem,2vw,1.25rem)] font-bold text-slate-800">
                  Guest Information
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="space-y-1">
                  <label
                    htmlFor="fullName"
                    className={`block text-xs font-semibold uppercase tracking-wide ${errors.fullName ? "text-red-600" : "text-slate-700"}`}
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={(e) =>
                      validateFieldOnBlur("fullName", e.target.value)
                    }
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                    className={`w-full border-b-2 bg-transparent px-1 py-3 text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.fullName ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                    placeholder="e.g. Alexander Hamilton"
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      role="alert"
                      className="mt-1 text-xs text-red-600"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className={`block text-xs font-semibold uppercase tracking-wide ${errors.email ? "text-red-600" : "text-slate-700"}`}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={(e) => validateFieldOnBlur("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full border-b-2 bg-transparent px-1 py-3 text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                    placeholder="alexander@example.com"
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1 text-xs text-red-600"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <label
                  htmlFor="phone"
                  className={`block text-xs font-semibold uppercase tracking-wide ${errors.phone ? "text-red-600" : "text-slate-700"}`}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={(e) => validateFieldOnBlur("phone", e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={`w-full border-b-2 bg-transparent px-1 py-3 text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                  placeholder="(555) 555-5555"
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="mt-1 text-xs text-red-600"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-2">
                <CreditCard
                  className="h-5 w-5 text-slate-700"
                  aria-hidden="true"
                />
                <h2 className="text-[clamp(1.05rem,2vw,1.25rem)] font-bold text-slate-800">
                  Payment Method
                </h2>
              </div>

              <div
                className="mb-8 grid grid-cols-2 gap-3"
                role="group"
                aria-label="Select payment method"
              >
                <button
                  type="button"
                  aria-pressed={paymentMethod === "card"}
                  onClick={() => handlePaymentMethodChange("card")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${paymentMethod === "card" ? "bg-teal-700 text-white shadow-lg" : "bg-gray-100 text-slate-800 hover:bg-gray-200"}`}
                >
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Credit Card
                </button>
                <button
                  type="button"
                  aria-pressed={paymentMethod === "wallet"}
                  onClick={() => handlePaymentMethodChange("wallet")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${paymentMethod === "wallet" ? "bg-teal-700 text-white shadow-lg" : "bg-gray-100 text-slate-800 hover:bg-gray-200"}`}
                >
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                  Digital Wallet
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="cardholderName"
                      className={`block text-xs font-semibold uppercase tracking-wide ${errors.cardholderName ? "text-red-600" : "text-slate-700"}`}
                    >
                      Cardholder Name
                    </label>
                    <input
                      id="cardholderName"
                      name="cardholderName"
                      type="text"
                      autoComplete="cc-name"
                      required
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      onBlur={(e) =>
                        validateFieldOnBlur("cardholderName", e.target.value)
                      }
                      aria-invalid={Boolean(errors.cardholderName)}
                      aria-describedby={
                        errors.cardholderName
                          ? "cardholderName-error"
                          : undefined
                      }
                      className={`w-full border-b-2 bg-transparent px-1 py-3 text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.cardholderName ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                      placeholder="As it appears on card"
                    />
                    {errors.cardholderName && (
                      <p
                        id="cardholderName-error"
                        role="alert"
                        className="mt-1 text-xs text-red-600"
                      >
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="cardNumber"
                      className={`block text-xs font-semibold uppercase tracking-wide ${errors.cardNumber ? "text-red-600" : "text-slate-700"}`}
                    >
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      required
                      maxLength="19"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      onBlur={(e) =>
                        validateFieldOnBlur("cardNumber", e.target.value)
                      }
                      aria-invalid={Boolean(errors.cardNumber)}
                      aria-describedby={
                        errors.cardNumber ? "cardNumber-error" : undefined
                      }
                      className={`w-full border-b-2 bg-transparent px-1 py-3 font-mono tracking-widest text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.cardNumber ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                      placeholder="0000 0000 0000 0000"
                    />
                    {errors.cardNumber && (
                      <p
                        id="cardNumber-error"
                        role="alert"
                        className="mt-1 text-xs text-red-600"
                      >
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                    <div className="space-y-1">
                      <label
                        htmlFor="expiry"
                        className={`block text-xs font-semibold uppercase tracking-wide ${errors.expiry ? "text-red-600" : "text-slate-700"}`}
                      >
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        required
                        maxLength="5"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        onBlur={(e) =>
                          validateFieldOnBlur("expiry", e.target.value)
                        }
                        aria-invalid={Boolean(errors.expiry)}
                        aria-describedby={
                          errors.expiry ? "expiry-error" : undefined
                        }
                        className={`w-full border-b-2 bg-transparent px-1 py-3 font-mono text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.expiry ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                        placeholder="MM/YY"
                      />
                      {errors.expiry && (
                        <p
                          id="expiry-error"
                          role="alert"
                          className="mt-1 text-xs text-red-600"
                        >
                          {errors.expiry}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="cvc"
                        className={`block text-xs font-semibold uppercase tracking-wide ${errors.cvc ? "text-red-600" : "text-slate-700"}`}
                      >
                        CVC
                      </label>
                      <input
                        id="cvc"
                        name="cvc"
                        type="text"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        required
                        maxLength="4"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        onBlur={(e) =>
                          validateFieldOnBlur("cvc", e.target.value)
                        }
                        aria-invalid={Boolean(errors.cvc)}
                        aria-describedby={errors.cvc ? "cvc-error" : undefined}
                        className={`w-full border-b-2 bg-transparent px-1 py-3 font-mono text-slate-700 outline-none transition placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-200 ${errors.cvc ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-teal-700"}`}
                        placeholder="123"
                      />
                      {errors.cvc && (
                        <p
                          id="cvc-error"
                          role="alert"
                          className="mt-1 text-xs text-red-600"
                        >
                          {errors.cvc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-[clamp(1.05rem,2vw,1.25rem)] font-bold text-slate-800">
                Special Requests (Optional)
              </h2>
              <div className="space-y-2">
                <label
                  htmlFor="specialRequests"
                  className={`block text-xs font-semibold uppercase tracking-wide ${errors.specialRequests ? "text-red-600" : "text-slate-700"}`}
                >
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="4"
                  maxLength={500}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  onBlur={(e) =>
                    validateFieldOnBlur("specialRequests", e.target.value)
                  }
                  aria-invalid={Boolean(errors.specialRequests)}
                  aria-describedby={
                    errors.specialRequests
                      ? "specialRequests-error specialRequests-help"
                      : "specialRequests-help"
                  }
                  className={`w-full resize-none rounded-lg border px-4 py-3 text-slate-700 outline-none transition-all placeholder-gray-500 ${errors.specialRequests ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"}`}
                  placeholder="e.g. Late check-in, dietary requirements or celebrating an occasion..."
                />
                {errors.specialRequests && (
                  <p
                    id="specialRequests-error"
                    role="alert"
                    className="mt-1 text-xs text-red-600"
                  >
                    {errors.specialRequests}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span id="specialRequests-help">Optional field</span>
                  <span>{formData.specialRequests.length}/500 characters</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right */}
          <aside className="space-y-6">
            {/* Progress bar */}
            <section
              className="text-right"
              aria-live="polite"
              aria-label="Booking progress"
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Step 3 of 3
              </div>
              <div className="text-2xl font-bold text-teal-700">
                {completionPercent}%
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label="Form completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercent}
              >
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </section>

            {/* Room summary card */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <img
                src={selectedRoomCover}
                alt={`${selectedRoom.name} room`}
                className="h-64 w-full object-cover"
              />

              <div className="space-y-4 p-6">
                <div>
                  <h3 className="mb-1 text-[clamp(1.1rem,2.3vw,1.3rem)] font-bold text-slate-900">
                    {selectedRoom.name}
                  </h3>
                  <p className="text-sm text-slate-700">
                    {selectedRoom.view} view · {selectedRoom.size} m²
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Dates</span>
                    <span className="font-semibold text-slate-900">
                      {formattedDates}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Duration</span>
                    <span className="font-semibold text-slate-900">
                      {nights} {nights === 1 ? "Night" : "Nights"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Guests</span>
                    <span className="font-semibold text-slate-900">
                      {adults} Adult{adults > 1 ? "s" : ""}
                      {children > 0
                        ? `, ${children} Child${children > 1 ? "ren" : ""}`
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-700">
                      Nightly Rate ({currency.format(nightlyRate)} x {nights})
                    </span>
                    <span className="font-semibold text-slate-900">
                      {currency.format(nightlyRate * nights)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">
                      Cleaning & Service Fee
                    </span>
                    <span className="font-semibold text-slate-900">
                      {currency.format(serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Taxes</span>
                    <span className="font-semibold text-slate-900">
                      {currency.format(taxes)}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      Total Price
                    </span>
                    <span className="text-3xl font-bold text-teal-700">
                      {currency.format(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 font-bold text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${isSubmitting ? "cursor-not-allowed bg-teal-600" : "bg-teal-700 hover:bg-teal-800 hover:shadow-xl"}`}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>

                <p className="flex items-center justify-center gap-1 text-center text-xs text-slate-700">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Secure SSL-encrypted payment
                </p>
              </div>
            </section>

            {/* Badges*/}
            <section className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#008009] p-4 text-center">
                <Shield
                  className="mx-auto mb-2 h-6 w-6 text-white"
                  aria-hidden="true"
                />
                <div className="text-base font-bold uppercase text-white">
                  Free Cancellation
                </div>
                <div className="mt-1 text-xs text-white/90">
                  Up to 24h before check-in
                </div>
              </div>

              <div className="rounded-lg bg-[#003580] p-4 text-center">
                <DollarSign
                  className="mx-auto mb-2 h-6 w-6 text-white"
                  aria-hidden="true"
                />
                <div className="text-base font-bold uppercase text-white">
                  Best Price Match
                </div>
                <div className="mt-1 text-xs text-white/90">
                  Guaranteed rate
                </div>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default ReservationView;
