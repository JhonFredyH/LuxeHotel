import React, { useEffect, useRef } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Hotel,
  Calendar,
  Clock,
  CreditCard,
  Edit,
  Trash2,
  Printer,
} from "lucide-react";

const ReservationDrawer = ({ isOpen, onClose, reservation, theme }) => {
  const drawerRef = useRef(null);
  const isDark = theme?.pageText?.includes("text-white");

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll de fondo al abrir
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 h-dvh w-full sm:max-w-[540px] ${
          isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
        } shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 border-b backdrop-blur-sm ${
            isDark
              ? "border-slate-700 bg-slate-900/90"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition ${
                  isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                }`}
                aria-label="Volver"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-medium text-[clamp(1rem,0.9rem+0.5vw,1.25rem)]">Detalles de Reserva</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100dvh-65px)] sm:h-[calc(100dvh-72px)] overflow-y-auto">
          <div className="p-4 sm:p-6 pb-8 sm:pb-10 space-y-5 sm:space-y-6">
            {/* Status Badge */}
            {reservation && (
              <>
                <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <User className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>Huésped</h3>
                        <span className={`inline-flex items-center justify-center w-[7.5rem] px-3 py-1 rounded-full text-[clamp(0.7rem,0.66rem+0.16vw,0.8rem)] font-medium shrink-0 ${
                          reservation.status === 'Confirmada'
                            ? isDark
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : reservation.status === 'Check-in'
                              ? isDark
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                              : reservation.status === 'Pendiente'
                                ? isDark
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-amber-100 text-amber-700 border border-amber-200"
                                : isDark
                                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          {reservation.status}
                        </span>
                      </div>
                      <p className={`mt-1 text-[clamp(0.9rem,0.84rem+0.2vw,1rem)] ${isDark ? "text-slate-200" : "text-slate-700"}`}>{reservation.guest}</p>
                      <div className={`mt-2 space-y-1.5 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{reservation.email || 'maria@email.com'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{reservation.phone || '+57 300 123 4567'}</span>
                        </div>
                        {reservation.document && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>{reservation.document}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <Hotel className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>Habitación</h3>
                      <p className={`font-medium mt-1 text-[clamp(1rem,0.92rem+0.35vw,1.12rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                        {reservation.room}
                      </p>
                      <div className={`mt-2 space-y-1 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        <p>🛏️ {reservation.beds || '2 camas matrimoniales'}</p>
                        <p>👥 {reservation.capacity || 'Máx. 4 personas'}</p>
                        {reservation.view && <p>🌊 {reservation.view}</p>}
                        {reservation.amenities && (
                          <p className="text-xs mt-2">
                            <span className={`px-2 py-1 rounded ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                              {reservation.amenities}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <Calendar className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>Fechas</h3>
                      <div className={`mt-2 space-y-2 text-[clamp(0.8rem,0.74rem+0.2vw,0.92rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                          <span>Check-in: {reservation.checkIn || '11 Feb, 15:00'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                          <span>Check-out: {reservation.checkOut || '14 Feb, 11:00'}</span>
                        </div>
                        <p className={`text-[clamp(0.78rem,0.74rem+0.2vw,0.88rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          🌙 {reservation.nights || '3 noches'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <CreditCard className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>Precio</h3>
                      <div className="mt-3 space-y-2">
                        <div className={`flex justify-between text-[clamp(0.82rem,0.76rem+0.2vw,0.93rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <span>Habitación</span>
                          <span>{reservation.roomPrice || '$800'}</span>
                        </div>
                        <div className={`flex justify-between text-[clamp(0.82rem,0.76rem+0.2vw,0.93rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <span>Impuestos (10%)</span>
                          <span>{reservation.tax || '$90'}</span>
                        </div>
                        <div className={`border-t pt-2 flex justify-between font-bold text-[clamp(1rem,0.92rem+0.35vw,1.15rem)] ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                          <span>Total</span>
                          <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>
                            {reservation.total || '$890'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                      <Printer className="w-4 h-4" />
                      Factura
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
 
  
   
};

export default ReservationDrawer;
