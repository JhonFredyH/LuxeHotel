import React, { useState, useEffect } from "react";
import { X, Calendar, User, Mail, Phone, Home, FileText, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_COLOR = {
  available:   { bg: "bg-emerald-50 border-emerald-200",   text: "text-emerald-800", sub: "text-emerald-600", selectedBg: "bg-emerald-100 border-emerald-400" },
  occupied:    { bg: "bg-blue-50 border-blue-200",         text: "text-blue-800",    sub: "text-blue-600",    selectedBg: "bg-blue-100 border-blue-400"       },
  maintenance: { bg: "bg-amber-50 border-amber-200",       text: "text-amber-800",   sub: "text-amber-600",   selectedBg: "bg-amber-100 border-amber-400"     },
  cleaning:    { bg: "bg-purple-50 border-purple-200",     text: "text-purple-800",  sub: "text-purple-600",  selectedBg: "bg-purple-100 border-purple-400"   },
};

const STATUS_COLOR_DARK = {
  available:   { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-200", sub: "text-emerald-400", selectedBg: "bg-emerald-500/25 border-emerald-500/60" },
  occupied:    { bg: "bg-blue-500/10 border-blue-500/30",       text: "text-blue-200",    sub: "text-blue-400",    selectedBg: "bg-blue-500/25 border-blue-500/60"       },
  maintenance: { bg: "bg-amber-500/10 border-amber-500/30",     text: "text-amber-200",   sub: "text-amber-400",   selectedBg: "bg-amber-500/25 border-amber-500/60"     },
  cleaning:    { bg: "bg-purple-500/10 border-purple-500/30",   text: "text-purple-200",  sub: "text-purple-400",  selectedBg: "bg-purple-500/25 border-purple-500/60"   },
};

const getToken = () => localStorage.getItem("token") || localStorage.getItem("guest_token");
const authHdr  = () => ({ ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) });

const ReservationModal = ({ isOpen, onClose, isDark, reservation = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestId: "", guestName: "", email: "", phone: "",
    checkIn: "", checkOut: "", roomId: "", roomNumber: "", notes: "",
  });

  const [roomTypes, setRoomTypes]       = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [units, setUnits]               = useState([]);       // room_units del tipo seleccionado
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [guestSearch, setGuestSearch]     = useState("");
  const [guestResults, setGuestResults]   = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [guestSelected, setGuestSelected] = useState(false);

  // ── Cargar tipos de habitación ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setLoadingRooms(true);
    fetch(`${API_URL}/rooms-admin`, { headers: authHdr() })
      .then((r) => r.json())
      .then((json) => setRoomTypes(json.data ?? []))
      .catch(() => setRoomTypes([]))
      .finally(() => setLoadingRooms(false));
  }, [isOpen]);

  // ── Cargar units cuando cambia roomId ─────────────────────
  useEffect(() => {
    if (!formData.roomId) { setUnits([]); return; }
    setLoadingUnits(true);
    fetch(`${API_URL}/rooms-admin/${formData.roomId}/units`, { headers: authHdr() })
      .then((r) => r.json())
      .then((data) => setUnits(Array.isArray(data) ? data : []))
      .catch(() => setUnits([]))
      .finally(() => setLoadingUnits(false));
  }, [formData.roomId]);

  // ── Reset / cargar edición ────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (reservation) {
      setFormData({
        guestId:    reservation.guest_id    ?? "",
        guestName:  reservation.guest_name  ?? reservation.guest ?? "",
        email:      reservation.email       ?? "",
        phone:      reservation.phone       ?? "",
        checkIn:    reservation.check_in_date  ?? reservation.checkIn  ?? "",
        checkOut:   reservation.check_out_date ?? reservation.checkOut ?? "",
        roomId:     reservation.room_id     ?? reservation.roomId ?? "",
        roomNumber: reservation.room_number ?? reservation.roomNumber ?? "",
        notes:      reservation.notes       ?? reservation.special_requests ?? "",
      });
      setGuestSelected(true);
    } else {
      setFormData({ guestId: "", guestName: "", email: "", phone: "", checkIn: "", checkOut: "", roomId: "", roomNumber: "", notes: "" });
      setGuestSearch("");
      setGuestResults([]);
      setGuestSelected(false);
    }
  }, [isOpen, reservation?.id]);

  // ── ESC + scroll lock ─────────────────────────────────────
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Búsqueda de guest ─────────────────────────────────────
  useEffect(() => {
    if (!guestSearch.trim() || guestSearch.length < 2) { setGuestResults([]); return; }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const r    = await fetch(`${API_URL}/guests?search=${encodeURIComponent(guestSearch)}&limit=5`);
        const json = await r.json();
        setGuestResults(json.data ?? json);
      } catch { setGuestResults([]); }
      finally  { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [guestSearch]);

  const selectGuest = (g) => {
    setFormData((p) => ({ ...p, guestId: g.id, guestName: `${g.first_name} ${g.last_name}`, email: g.email, phone: g.phone ?? "" }));
    setGuestSearch(`${g.first_name} ${g.last_name}`);
    setGuestResults([]);
    setGuestSelected(true);
  };

  const clearGuest = () => {
    setFormData((p) => ({ ...p, guestId: "", guestName: "", email: "", phone: "" }));
    setGuestSearch("");
    setGuestSelected(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomId") { setFormData((p) => ({ ...p, roomId: value, roomNumber: "" })); return; }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); onClose(); };

  if (!isOpen) return null;

  const isEditMode   = !!reservation;
  const selectedRoom = roomTypes.find((r) => r.id === formData.roomId);
  const sc           = isDark ? STATUS_COLOR_DARK : STATUS_COLOR;

  const inputCls = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors ${
    isDark ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
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
            isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-gradient-to-r from-emerald-50 to-emerald-100/30 border-slate-200"
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

            {/* ── Guest ── */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Guest Information</h3>

              {!guestSelected ? (
                <div className="relative mb-3">
                  <label className={labelCls}>Search existing guest</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={guestSearch} onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Name or email..." className={`${inputCls} pl-9`} />
                    {searchLoading && (
                      <svg className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                  </div>
                  {guestResults.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg overflow-hidden ${isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}>
                      {guestResults.map((g) => (
                        <li key={g.id} onClick={() => selectGuest(g)}
                          className={`px-4 py-3 cursor-pointer text-sm transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-emerald-50"}`}>
                          <p className="font-medium">{g.first_name} {g.last_name}</p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{g.email}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${isDark ? "bg-emerald-900/30 border border-emerald-700/40" : "bg-emerald-50 border border-emerald-200"}`}>
                  <div>
                    <p className="text-sm font-semibold">{formData.guestName}</p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{formData.email}</p>
                  </div>
                  <button type="button" onClick={clearGuest} className="text-xs text-red-500 hover:text-red-400 font-medium">Change</button>
                </div>
              )}

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
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Reservation Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Check-in Date *</label>
                    <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Check-out Date *</label>
                    <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className={inputCls} />
                  </div>
                </div>

                {/* Room type */}
                <div>
                  <label className={labelCls}>
                    <Home className="w-3.5 h-3.5 inline mr-1" />Room *
                    {loadingRooms && <span className="ml-2 text-xs text-slate-400">(loading...)</span>}
                  </label>
                  <select name="roomId" value={formData.roomId} onChange={handleChange} required className={inputCls}>
                    <option value="">— Select a room type —</option>
                    {roomTypes.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} · ${Number(room.price_per_night).toLocaleString()}/night · Max {room.max_guests} guests
                      </option>
                    ))}
                  </select>
                  {selectedRoom && (
                    <p className={`mt-1 text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                      ✓ {selectedRoom.size_m2 ? `${selectedRoom.size_m2}m²` : ""}
                      {selectedRoom.view_type ? ` · ${selectedRoom.view_type} view` : ""}
                      {selectedRoom.floor ? ` · Floor ${selectedRoom.floor}` : ""}
                      {` · Adults: ${selectedRoom.max_adults} / Children: ${selectedRoom.max_children}`}
                    </p>
                  )}
                </div>

                {/* Room units con estado real */}
                <div>
                  <label className={labelCls}>Room number *</label>

                  {!formData.roomId && (
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Select a room type first.</p>
                  )}

                  {formData.roomId && loadingUnits && (
                    <div className="flex items-center gap-2 py-3">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading units...</span>
                    </div>
                  )}

                  {formData.roomId && !loadingUnits && units.length === 0 && (
                    <p className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>No units available.</p>
                  )}

                  {formData.roomId && !loadingUnits && units.length > 0 && (
                    <>
                      {/* Leyenda */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        {[
                          { status: "available",   label: "Available"   },
                          { status: "occupied",    label: "Occupied"    },
                          { status: "maintenance", label: "Maintenance" },
                          { status: "cleaning",    label: "Cleaning"    },
                        ].filter((s) => units.some((u) => u.status === s.status)).map((s) => (
                          <span key={s.status} className="flex items-center gap-1.5 text-xs">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              s.status === "available"   ? "bg-emerald-500" :
                              s.status === "occupied"    ? "bg-blue-500"    :
                              s.status === "maintenance" ? "bg-amber-500"   : "bg-purple-500"
                            }`} />
                            <span className={isDark ? "text-slate-400" : "text-slate-500"}>{s.label}</span>
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {units.map((unit) => {
                          const st       = unit.status || "available";
                          const colors   = sc[st] || sc.available;
                          const isAvail  = st === "available";
                          const selected = formData.roomNumber === unit.unit_number;

                          return (
                            <button
                              key={unit.id}
                              type="button"
                              disabled={!isAvail}
                              onClick={() => isAvail && setFormData((p) => ({ ...p, roomNumber: unit.unit_number }))}
                              className={`rounded-xl border p-3 text-left transition-all ${
                                !isAvail
                                  ? `${colors.bg} opacity-60 cursor-not-allowed`
                                  : selected
                                    ? `${colors.selectedBg} ring-2 ring-emerald-500/50`
                                    : `${colors.bg} hover:scale-[1.02] cursor-pointer`
                              }`}
                            >
                              <p className={`text-xl font-bold leading-none ${colors.text}`}>{unit.unit_number}</p>
                              <p className={`mt-1.5 text-xs font-medium capitalize ${colors.sub}`}>{st}</p>
                              {!isAvail && (
                                <p className="mt-1 text-xs opacity-60">Unavailable</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Notes ── */}
            <div>
              <label className={labelCls}><FileText className="w-3.5 h-3.5 inline mr-1" />Special Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Special requests, preferences, allergies..." rows={3} className={`${inputCls} resize-none`} />
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
