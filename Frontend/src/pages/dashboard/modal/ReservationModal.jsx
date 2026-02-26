import React, { useState, useEffect } from "react";
import { X, Calendar, User, Mail, Phone, Home, FileText, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ReservationModal = ({
  isOpen,
  onClose,
  isDark,
  reservation = null,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    guestId: "",
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomId: "",
    roomNumber: "",
    notes: "",
  });

  // Room types desde la BD
  const [roomTypes, setRoomTypes]       = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Búsqueda de guest existente
  const [guestSearch, setGuestSearch]   = useState("");
  const [guestResults, setGuestResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [guestSelected, setGuestSelected] = useState(false);

  // ── Cargar tipos de habitación disponibles ───────────────────
  useEffect(() => {
    if (!isOpen) return;
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("guest_token");
        const adminRes = await fetch(`${API_URL}/rooms-admin`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (adminRes.ok) {
          const adminJson = await adminRes.json();
          setRoomTypes(adminJson.data ?? []);
          return;
        }

        const res = await fetch(`${API_URL}/rooms?is_active=true&limit=100`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const rooms = (json.data ?? json).map((room) => ({
          ...room,
          room_numbers: [],
        }));
        setRoomTypes(rooms);
      } catch {
        setRoomTypes([]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [isOpen]);

  // ── Cargar datos si es edición ───────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (reservation) {
      setFormData({
        guestId:   reservation.guest_id   ?? "",
        guestName: reservation.guest_name ?? reservation.guest ?? "",
        email:     reservation.email      ?? "",
        phone:     reservation.phone      ?? "",
        checkIn:   reservation.check_in_date  ?? reservation.checkIn  ?? "",
        checkOut:  reservation.check_out_date ?? reservation.checkOut ?? "",
        roomId:    reservation.room_id    ?? reservation.roomId ?? "",
        roomNumber: reservation.room_number ?? reservation.roomNumber ?? "",
        notes:     reservation.notes      ?? reservation.special_requests ?? "",
      });
      setGuestSelected(true);
    } else {
      setFormData({ guestId: "", guestName: "", email: "", phone: "", checkIn: "", checkOut: "", roomId: "", roomNumber: "", notes: "" });
      setGuestSearch("");
      setGuestResults([]);
      setGuestSelected(false);
    } 
  }, [isOpen, reservation?.id, reservation]);

  // ── ESC y scroll lock ────────────────────────────────────────
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Búsqueda de guest con debounce ───────────────────────────
  useEffect(() => {
    if (!guestSearch.trim() || guestSearch.length < 2) {
      setGuestResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`${API_URL}/guests?search=${encodeURIComponent(guestSearch)}&limit=5`);
        const json = await res.json();
        setGuestResults(json.data ?? json);
      } catch {
        setGuestResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [guestSearch]);

  const selectGuest = (g) => {
    setFormData((prev) => ({
      ...prev,
      guestId:   g.id,
      guestName: `${g.first_name} ${g.last_name}`,
      email:     g.email,
      phone:     g.phone ?? "",
    }));
    setGuestSearch(`${g.first_name} ${g.last_name}`);
    setGuestResults([]);
    setGuestSelected(true);
  };

  const clearGuest = () => {
    setFormData((prev) => ({ ...prev, guestId: "", guestName: "", email: "", phone: "" }));
    setGuestSearch("");
    setGuestSelected(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomId") {
      setFormData((prev) => ({ ...prev, roomId: value, roomNumber: "" }));
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;
  const isEditMode = !!reservation;
  const selectedRoom = roomTypes.find((r) => r.id === formData.roomId);
  const roomNumbers = selectedRoom?.room_numbers ?? [];

  // ── Helpers de estilo ────────────────────────────────────────
  const inputCls = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
    isDark
      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
  }`;

  const labelCls = `block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-slate-900 border border-slate-700/50" : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b flex items-center justify-between ${
            isDark
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-gradient-to-r from-emerald-50 to-emerald-100/30 border-slate-200"
          }`}>
            <div>
              <h2 className="text-2xl font-bold">{isEditMode ? "Edit Reservation" : "New Reservation"}</h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isEditMode ? "Update reservation details" : "Complete guest and reservation details"}
              </p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">

            {/* ── Guest Search ── */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Guest Information
              </h3>

              {/* Buscador */}
              {!guestSelected ? (
                <div className="relative mb-3">
                  <label className={labelCls}>Search existing guest</label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                    <input
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Name or email..."
                      className={`${inputCls} pl-9`}
                    />
                    {searchLoading && (
                      <svg className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                  </div>

                  {/* Resultados */}
                  {guestResults.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg overflow-hidden ${
                      isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"
                    }`}>
                      {guestResults.map((g) => (
                        <li
                          key={g.id}
                          onClick={() => selectGuest(g)}
                          className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                            isDark ? "hover:bg-slate-700" : "hover:bg-emerald-50"
                          }`}
                        >
                          <p className="font-medium">{g.first_name} {g.last_name}</p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{g.email}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${
                  isDark ? "bg-emerald-900/30 border border-emerald-700/40" : "bg-emerald-50 border border-emerald-200"
                }`}>
                  <div>
                    <p className="text-sm font-semibold">{formData.guestName}</p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{formData.email}</p>
                  </div>
                  <button type="button" onClick={clearGuest} className="text-xs text-red-500 hover:text-red-400 font-medium">
                    Change
                  </button>
                </div>
              )}

              {/* Campos manuales (si no se seleccionó de la lista) */}
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input type="text" name="guestName" value={formData.guestName} onChange={handleChange}
                    placeholder="Guest full name" required className={inputCls} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}><Mail className="w-3.5 h-3.5 inline mr-1" />Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="email@example.com" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+57 300 000 0000" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Reservation Details ── */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Reservation Details
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Check-in Date *</label>
                    <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange}
                      required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Check-out Date *</label>
                    <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange}
                      required className={inputCls} />
                  </div>
                </div>

                {/* Room Type desde la BD */}
                <div>
                  <label className={labelCls}>
                    <Home className="w-3.5 h-3.5 inline mr-1" />
                    Room *
                    {loadingRooms && <span className="ml-2 text-xs text-slate-400">(loading...)</span>}
                  </label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">— Select a room type —</option>
                    {roomTypes.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} · ${Number(room.price_per_night).toLocaleString()}/night · Max {room.max_guests} guests
                      </option>
                    ))}
                    {roomTypes.length === 0 && !loadingRooms && (
                      <option disabled>No room types found</option>
                    )}
                  </select>
                  {formData.roomId && (() => {
                    const selected = selectedRoom;
                    return selected ? (
                      <p className={`mt-1 text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        ✓ {selected.size_m2 ? `${selected.size_m2}m²` : ""} 
                        {selected.view_type ? ` · ${selected.view_type} view` : ""}
                        {selected.floor ? ` · Floor ${selected.floor}` : ""}
                        {` · Adults: ${selected.max_adults} / Children: ${selected.max_children}`}
                      </p>
                    ) : null;
                  })()}
                </div>

                <div>
                  <label className={labelCls}>Room numbers *</label>
                  {!formData.roomId && (
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Select a room type first.
                    </p>
                  )}
                  {formData.roomId && roomNumbers.length === 0 && (
                    <p className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                      No room numbers available for this room type.
                    </p>
                  )}
                  {formData.roomId && roomNumbers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {roomNumbers.map((number) => {
                        const selected = formData.roomNumber === number;
                        return (
                          <button
                            key={number}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, roomNumber: number }))
                            }
                            className={`w-full rounded-xl border p-4 text-left transition-all ${
                              selected
                                ? isDark
                                  ? "bg-emerald-500/20 border-emerald-500/50"
                                  : "bg-emerald-50 border-emerald-300"
                                : isDark
                                  ? "bg-slate-800/60 border-slate-700 hover:border-emerald-500/40"
                                  : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            <p
                              className={`text-3xl font-bold leading-none ${
                                selected
                                  ? isDark
                                    ? "text-emerald-200"
                                    : "text-emerald-800"
                                  : isDark
                                    ? "text-slate-100"
                                    : "text-slate-800"
                              }`}
                            >
                              {number}
                            </p>
                            <p
                              className={`mt-2 text-sm ${
                                selected
                                  ? isDark
                                    ? "text-emerald-300"
                                    : "text-emerald-700"
                                  : isDark
                                    ? "text-slate-400"
                                    : "text-slate-500"
                              }`}
                            >
                              Available
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Notes ── */}
            <div>
              <label className={labelCls}>
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                Special Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Special requests, preferences, allergies..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
          </form>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 ${
            isDark ? "border-slate-700/50 bg-slate-800/30" : "border-slate-200 bg-slate-50"
          }`}>
            <button type="button" onClick={onClose}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}>
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm hover:shadow-md">
              {isEditMode ? "Save Changes" : "Create Reservation"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationModal;
