import React, { useState, useEffect } from "react";
import { X, Calendar, User, Mail, Phone, Home, FileText } from "lucide-react";

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  isDark, 
  reservation = null, // Si existe, es modo edición
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "STANDARD",
    notes: "",
  });

  const roomTypes = ["STANDARD", "DELUXE", "SUITE", "PREMIUM", "PRESIDENCIAL"];

  // Cargar datos si es modo edición (solo cuando cambia isOpen o reservation.id)
  useEffect(() => {
    if (!isOpen) return; // Solo actualizar cuando el modal se abre
    
    if (reservation) {
      setFormData({
        guestName: reservation.guest || "",
        email: reservation.email || "",
        phone: reservation.phone || "",
        checkIn: reservation.checkIn || "",
        checkOut: reservation.checkOut || "",
        roomType: reservation.roomType || "STANDARD",
        notes: reservation.notes || "",
      });
    } else {
      // Resetear formulario si no hay reserva
      setFormData({
        guestName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        roomType: "STANDARD",
        notes: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reservation?.id]); // Solo depende de isOpen y el ID de la reserva

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const isEditMode = !!reservation;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDark
              ? "bg-slate-900 border border-slate-700/50"
              : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-5 border-b flex items-center justify-between ${
              isDark
                ? "bg-slate-800/50 border-slate-700/50"
                : "bg-gradient-to-r from-emerald-50 to-emerald-100/30 border-slate-200"
            }`}
          >
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit Reservation" : "New Reservation"}
              </h2>
              <p
                className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {isEditMode 
                  ? "Update guest and reservation details"
                  : "Complete guest and reservation details"}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]"
          >
            <div className="space-y-5">
              {/* Guest Information Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Guest Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="Guest full name"
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+57 300 000 0000"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservation Details Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Reservation Details
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200"
                            : "bg-white border-slate-300 text-slate-800"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200"
                            : "bg-white border-slate-300 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 inline mr-1" />
                      Room Type *
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Notes Section */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  Special Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special requests, preferences, allergies..."
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors resize-none ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                  }`}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div
            className={`px-6 py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 ${
              isDark
                ? "border-slate-700/50 bg-slate-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm hover:shadow-md"
            >
              {isEditMode ? "Save Changes" : "Create Reservation"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationModal;
