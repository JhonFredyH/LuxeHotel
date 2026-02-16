import React, { useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  FileText,
  Hotel,
} from "lucide-react";

const GuestDetailModal = ({ 
  isOpen, 
  onClose, 
  guest, 
  theme,
  onEdit,
  onDelete,
}) => {
  const isDark = theme?.pageText?.includes("text-white");

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEsc);
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

  if (!isOpen || !guest) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(guest);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this guest?')) {
      onDelete(guest.id);
      onClose();
    }
  };

  const fullName = `${guest.firstName || ''} ${guest.lastName || ''}`.trim();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
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
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-medium text-[clamp(1rem,0.9rem+0.5vw,1.25rem)]">
                Guest Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100dvh-65px)] sm:h-[calc(100dvh-72px)] overflow-y-auto">
          <div className="p-4 sm:p-6 pb-8 sm:pb-10 space-y-5 sm:space-y-6">
            
            {/* Personal Information */}
            <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <User className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                    Personal Information
                  </h3>
                  <p className={`mt-1 text-[clamp(0.9rem,0.84rem+0.2vw,1rem)] font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {fullName}
                  </p>
                  <div className={`mt-2 space-y-1.5 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{guest.phone}</span>
                    </div>
                    {guest.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Born: {guest.dateOfBirth}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Identification */}
            <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <CreditCard className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                    Identification
                  </h3>
                  <div className={`mt-2 space-y-1 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <p><span className="font-medium">{guest.documentType}:</span> {guest.document}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {(guest.address || guest.city || guest.country) && (
              <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <MapPin className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                      Address
                    </h3>
                    <div className={`mt-2 space-y-1 text-[clamp(0.8rem,0.74rem+0.2vw,0.92rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {guest.address && <p>{guest.address}</p>}
                      {(guest.city || guest.country) && (
                        <p>{[guest.city, guest.country].filter(Boolean).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reservations History */}
            <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <Hotel className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                    Reservation History
                  </h3>
                  <div className={`mt-3 space-y-2 text-[clamp(0.82rem,0.76rem+0.2vw,0.93rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                      <p className="font-medium">Total Stays: {guest.totalStays || 0}</p>
                      <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Last visit: {guest.lastVisit || 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {guest.notes && (
              <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <FileText className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-[clamp(0.95rem,0.88rem+0.25vw,1.05rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                      Notes
                    </h3>
                    <p className={`mt-2 text-[clamp(0.8rem,0.74rem+0.2vw,0.92rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {guest.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className={`border-t pt-5 sm:pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit Guest
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestDetailModal;
