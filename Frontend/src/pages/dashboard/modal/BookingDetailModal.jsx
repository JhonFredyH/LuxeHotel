import React, { useEffect, useRef } from "react";
import {
  X, User, Mail, Phone, Hotel, Calendar, Clock,
  CreditCard, Edit, Trash2, Printer, LogIn, LogOut,
} from "lucide-react";

const BookingDetailModal = ({
  isOpen,
  onClose,
  reservation,
  theme,
  onEdit,
  onCancel,
  onCheckIn,
  onCheckOut,
  onPrint,
}) => {
  const drawerRef = useRef(null);
  const isDark = theme?.pageText?.includes("text-white");

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  // ── Normalizar campos (API real vs mock) ─────────────────
  const status      = reservation.status ?? "";
  const guestName   = reservation.guest_name  ?? reservation.guest ?? "—";
  const email       = reservation.email       ?? "—";
  const phone       = reservation.phone       ?? "—";
  const roomName    = reservation.room_number ?? reservation.room  ?? "—";
  const roomType    = reservation.room_type   ?? "";
  const checkIn     = reservation.check_in_date  ?? reservation.checkIn  ?? "—";
  const checkOut    = reservation.check_out_date ?? reservation.checkOut ?? "—";
  const totalPrice  = reservation.total_price ?? reservation.total ?? 0;
  const adults      = reservation.adults    ?? "—";
  const children    = reservation.children  ?? 0;
  const notes       = reservation.special_requests ?? reservation.notes ?? "";

  // Calcular noches
  const nights = (() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const n = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      return n > 0 ? n : "—";
    } catch { return "—"; }
  })();

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return d; }
  };

  const formatCurrency = (v) =>
    typeof v === "number"
      ? `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : v;

  // ── Status badge ─────────────────────────────────────────
  const statusBadge = () => {
    const s = status.toLowerCase();
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";
    if (s === "confirmed")   return `${base} bg-emerald-100 text-emerald-700 border-emerald-200`;
    if (s === "pending")     return `${base} bg-amber-100 text-amber-700 border-amber-200`;
    if (s === "checked_in")  return `${base} bg-blue-100 text-blue-700 border-blue-200`;
    if (s === "checked_out") return `${base} bg-pink-100 text-pink-700 border-pink-200`;
    if (s === "cancelled")   return `${base} bg-red-100 text-red-700 border-red-200`;
    return `${base} bg-slate-100 text-slate-700 border-slate-200`;
  };

  const statusLabel = () => {
    const s = status.toLowerCase();
    if (s === "checked_in")  return "Check-in";
    if (s === "checked_out") return "Check-out";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ── Qué botones mostrar según status ─────────────────────
  const canCheckIn  = ["confirmed", "pending"].includes(status.toLowerCase());
  const canCheckOut = status.toLowerCase() === "checked_in";
  const canCancel   = !["checked_out", "cancelled"].includes(status.toLowerCase());
  const canEdit     = !["checked_out", "cancelled"].includes(status.toLowerCase());

  // ── Estilos reutilizables ────────────────────────────────
  const section = `border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`;
  const iconBox = `mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`;
  const iconCls = `w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`;
  const sectionTitle = `font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`;
  const textSm = `text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 h-dvh w-full sm:max-w-[540px] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 border-b backdrop-blur-sm ${isDark ? "border-slate-700 bg-slate-900/90" : "border-slate-200 bg-white/90"}`}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-medium text-[clamp(1rem,0.9rem+0.5vw,1.25rem)]">Reservation Details</h2>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100dvh-65px)] overflow-y-auto">
          <div className="p-4 sm:p-6 pb-10 space-y-5 sm:space-y-6">

            {/* Guest */}
            <div className={section}>
              <div className="flex items-start gap-3">
                <div className={iconBox}><User className={iconCls} /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className={sectionTitle}>Guest</h3>
                    <span className={statusBadge()}>{statusLabel()}</span>
                  </div>
                  <p className={`font-semibold text-base ${isDark ? "text-white" : "text-slate-900"}`}>{guestName}</p>
                  <div className={`mt-2 space-y-1.5 ${textSm}`}>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{email}</span></div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{phone}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room */}
            <div className={section}>
              <div className="flex items-start gap-3">
                <div className={iconBox}><Hotel className={iconCls} /></div>
                <div className="flex-1">
                  <h3 className={sectionTitle}>Room</h3>
                  <p className={`font-semibold text-base mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{roomName}</p>
                  {roomType && <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{roomType}</p>}
                  <div className={`mt-2 space-y-1 ${textSm}`}>
                    <p>👥 Adults: {adults}{children > 0 ? ` · Children: ${children}` : ""}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className={section}>
              <div className="flex items-start gap-3">
                <div className={iconBox}><Calendar className={iconCls} /></div>
                <div className="flex-1">
                  <h3 className={sectionTitle}>Dates</h3>
                  <div className={`mt-2 space-y-2 ${textSm}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Check-in: <strong>{formatDate(checkIn)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Check-out: <strong>{formatDate(checkOut)}</strong></span>
                    </div>
                    <p>🌙 {nights} {nights === 1 ? "night" : "nights"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className={section}>
              <div className="flex items-start gap-3">
                <div className={iconBox}><CreditCard className={iconCls} /></div>
                <div className="flex-1">
                  <h3 className={sectionTitle}>Price</h3>
                  <div className="mt-3 space-y-2">
                    <div className={`border-t pt-2 flex justify-between font-bold text-base ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                      <span>Total</span>
                      <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className={section}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Special Requests</p>
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className={section}>
              <div className="grid grid-cols-2 gap-3">

                {/* Check-in */}
                {canCheckIn && (
                  <button
                    onClick={() => onCheckIn?.(reservation.id)}
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                  >
                    <LogIn className="w-4 h-4" /> Check-in
                  </button>
                )}

                {/* Check-out */}
                {canCheckOut && (
                  <button
                    onClick={() => onCheckOut?.(reservation.id)}
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Check-out
                  </button>
                )}

                {/* Edit */}
                {canEdit && (
                  <button
                    onClick={() => onEdit?.(reservation)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition font-medium"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                )}

                {/* Cancel */}
                {canCancel && (
                  <button
                    onClick={() => onCancel?.(reservation.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Cancel
                  </button>
                )}

                {/* Invoice */}
                <button
                  onClick={() => onPrint?.(reservation)}
                  className={`${canEdit && canCancel ? "col-span-2" : "col-span-1"} flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium`}
                >
                  <Printer className="w-4 h-4" /> Invoice
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetailModal;
