import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const roomStatusOptions = ["Available", "Occupied", "Maintenance", "Cleaning"];

const RoomModal = ({
  isOpen,
  onClose,
  room,
  isDark,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [draftStatus, setDraftStatus] = useState("Available");

  // Sincronizar draftStatus con el estado de la habitación y resetear tab
  useEffect(() => {
    if (!isOpen) return; // Solo actualizar cuando el modal está abierto
    
    // Resetear tab al abrir
    setActiveTab("info");
    
    // Sincronizar estado
    if (room) {
      setDraftStatus(room.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, room?.id]); // Solo cuando abre o cambia la habitación

  // Cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return undefined;
    const onEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !room) return null;

  const handleSave = () => {
    if (onStatusChange) {
      onStatusChange(room.id, draftStatus);
    }
    onClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(room);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(room.id);
    }
    onClose();
  };

  const typeLabel = room.type.charAt(0) + room.type.slice(1).toLowerCase();

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
          className={`w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-slate-900 border border-slate-700/50" : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-bold">{room.number}</h2>
                <span className={`text-base font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {typeLabel}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold">{room.price}</p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{room.priceUnit}</p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"}`}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`px-6 border-b ${isDark ? "border-slate-700/50" : "border-slate-200"}`}>
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "info"
                    ? "border-emerald-500 text-emerald-500"
                    : `border-transparent ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-emerald-500 text-emerald-500"
                    : `border-transparent ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab("actions")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "actions"
                    ? "border-emerald-500 text-emerald-500"
                    : `border-transparent ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`
                }`}
              >
                Actions
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[50vh]">
            {activeTab === "info" && (
              <div className="space-y-5">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <p className={`text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>Type</p>
                    <p className="text-sm font-semibold">{room.type}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <p className={`text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>Floor</p>
                    <p className="text-sm font-semibold">{room.floor}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <p className={`text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>Capacity</p>
                    <p className="text-sm font-semibold">{room.capacity}</p>
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <p className="text-sm font-semibold mb-2">Status</p>
                  <div className="flex items-center gap-3">
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      {roomStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm font-semibold mb-2">Features</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-lg p-3 text-sm ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                      {room.view}
                    </div>
                    <div className={`rounded-lg p-3 text-sm ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                      {room.details}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm font-semibold mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.split(", ").map((amenity) => (
                      <span
                        key={amenity}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          isDark
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3">
                <div className={`rounded-lg p-4 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Recent activity</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-slate-600"}>Check-out:</span>
                      <span className="font-medium">{room.checkOut || "No record"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-slate-600"}>Guest:</span>
                      <span className="font-medium">{room.guest || "None"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "actions" && (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleEdit}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Edit Room
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  Delete Room
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-6 py-3 border-t flex justify-end gap-2 ${isDark ? "border-slate-700/50 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomModal;
