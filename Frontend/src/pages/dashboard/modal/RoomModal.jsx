import React, { useEffect, useState, useCallback } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const API = "http://localhost:8000";

const STATUS_OPTIONS = [
  { value: "available",   label: "Available",   dot: "bg-emerald-500" },
  { value: "occupied",    label: "Occupied",     dot: "bg-blue-500"   },
  { value: "maintenance", label: "Maintenance",  dot: "bg-amber-500"  },
  { value: "cleaning",    label: "Cleaning",     dot: "bg-purple-500" },
];

// ── Clases de color por estado ────────────────────────────────
const cardBg = {
  available:   { dark: "bg-emerald-500/15 border-emerald-500/40", light: "bg-emerald-50 border-emerald-200" },
  occupied:    { dark: "bg-blue-500/15 border-blue-500/40",       light: "bg-blue-50 border-blue-200"       },
  maintenance: { dark: "bg-amber-500/15 border-amber-500/40",     light: "bg-amber-50 border-amber-200"     },
  cleaning:    { dark: "bg-purple-500/15 border-purple-500/40",   light: "bg-purple-50 border-purple-200"   },
};
const numColor = {
  available:   { dark: "text-emerald-200", light: "text-emerald-800" },
  occupied:    { dark: "text-blue-200",    light: "text-blue-800"    },
  maintenance: { dark: "text-amber-200",   light: "text-amber-800"   },
  cleaning:    { dark: "text-purple-200",  light: "text-purple-800"  },
};
const statusText = {
  available:   { dark: "text-emerald-300", light: "text-emerald-700" },
  occupied:    { dark: "text-blue-300",    light: "text-blue-700"    },
  maintenance: { dark: "text-amber-300",   light: "text-amber-700"   },
  cleaning:    { dark: "text-purple-300",  light: "text-purple-700"  },
};
const menuBtn = {
  available:   { dark: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/40", light: "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300" },
  occupied:    { dark: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/40",             light: "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300"             },
  maintenance: { dark: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40",         light: "bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300"         },
  cleaning:    { dark: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-500/40",     light: "bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"     },
};
const badgeCls = {
  available:   { dark: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", light: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  occupied:    { dark: "bg-blue-500/20 text-blue-300 border-blue-500/30",           light: "bg-blue-100 text-blue-700 border-blue-200"           },
  maintenance: { dark: "bg-amber-500/20 text-amber-300 border-amber-500/30",        light: "bg-amber-100 text-amber-700 border-amber-200"        },
  cleaning:    { dark: "bg-purple-500/20 text-purple-300 border-purple-500/30",     light: "bg-purple-100 text-purple-700 border-purple-200"     },
};

const c = (map, status, isDark) =>
  (map[status] || map.available)[isDark ? "dark" : "light"];

// ── Helpers ───────────────────────────────────────────────────
const token    = () => localStorage.getItem("token");
const authHdr  = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

const RoomModal = ({ isOpen, onClose, room, isDark, onEdit, onDelete }) => {
  const [activeTab, setActiveTab]       = useState("info");
  const [units, setUnits]               = useState([]);           
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [savingUnit, setSavingUnit]     = useState(null);         // uuid del unit que se está guardando
  const [openMenu, setOpenMenu]         = useState(null);         // uuid del unit con menú abierto
  const [newUnitNum, setNewUnitNum]     = useState("");           // input agregar unidad
  const [addingUnit, setAddingUnit]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");

  // ── Cargar units desde la API ─────────────────────────────
  const fetchUnits = useCallback(async () => {
    if (!room?.id) return;
    setLoadingUnits(true);
    try {
      const res  = await fetch(`${API}/rooms-admin/${room.id}/units`, { headers: authHdr() });
      const data = await res.json();
      setUnits(Array.isArray(data) ? data : []);
    } catch {
      setUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  }, [room?.id]);

  // ── Reset al abrir / cambiar habitación ──────────────────
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("info");
    setOpenMenu(null);
    setNewUnitNum("");
    setErrorMsg("");
    fetchUnits();
  }, [isOpen, room?.id]);   // eslint-disable-line

  // ── Tecla ESC + bloquear scroll ──────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onEsc); };
  }, [isOpen, onClose]);

  // ── Cerrar menú al hacer click fuera ─────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const close = (e) => { if (!e.target.closest("[data-unit-menu]")) setOpenMenu(null); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isOpen]);

  if (!isOpen || !room) return null;

  // ── Cambiar estado de una unidad ─────────────────────────
  const handleStatusChange = async (unit, newStatus) => {
    setSavingUnit(unit.id);
    setOpenMenu(null);
    // Optimistic update
    setUnits((prev) => prev.map((u) => u.id === unit.id ? { ...u, status: newStatus } : u));
    try {
      await fetch(`${API}/rooms-admin/units/${unit.id}/status`, {
        method: "PATCH",
        headers: authHdr(),
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revertir si falla
      setUnits((prev) => prev.map((u) => u.id === unit.id ? { ...u, status: unit.status } : u));
      setErrorMsg("Could not save status. Check connection.");
    } finally {
      setSavingUnit(null);
    }
  };

  // ── Agregar unidad nueva ─────────────────────────────────
  const handleAddUnit = async () => {
    const num = newUnitNum.trim();
    if (!num) return;
    if (units.some((u) => u.unit_number === num)) {
      setErrorMsg(`Unit "${num}" already exists.`);
      return;
    }
    setAddingUnit(true);
    setErrorMsg("");
    try {
      const res  = await fetch(`${API}/rooms-admin/${room.id}/units`, {
        method: "POST",
        headers: authHdr(),
        body: JSON.stringify({ unit_number: num }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUnits((prev) => [...prev, data]);
      setNewUnitNum("");
    } catch {
      setErrorMsg("Could not add unit. Check connection.");
    } finally {
      setAddingUnit(false);
    }
  };

  
  const amenities    = Array.isArray(room.amenities) ? room.amenities : [];
  const overallStatus = room.status || "available";
  const statusLabel  = STATUS_OPTIONS.find((s) => s.value === overallStatus)?.label || overallStatus;

  // Conteo de unidades por estado para el resumen
  const unitCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = units.filter((u) => u.status === s.value).length;
    return acc;
  }, {});

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-3xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col ${
            isDark ? "bg-slate-900 border border-slate-700/50" : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b flex-shrink-0 ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">{room.name}</h2>
                <span className={`px-2.5 py-1 rounded-lg font-medium text-xs border ${c(badgeCls, overallStatus, isDark)}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold">${Number(room.price_per_night || 0).toLocaleString()}</p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    /night · {units.length || room.quantity || 1} room{(units.length || room.quantity || 1) !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mini resumen de estados */}
            {units.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {STATUS_OPTIONS.filter((s) => unitCounts[s.value] > 0).map((s) => (
                  <span key={s.value} className="flex items-center gap-1.5 text-xs font-medium">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                      {unitCounts[s.value]} {s.label}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

         

          {/* ── Contenido scrollable ──────────────────────── */}
          <div className="px-6 py-5 overflow-y-auto flex-1">

            {/* ════ TAB: INFORMATION ════ */}
            {activeTab === "info" && (
              <div className="space-y-5">

                {/* Info básica */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Floor",    value: room.floor || "N/A"    },
                    { label: "Capacity", value: `${room.max_guests} guests` },
                    { label: "Size",     value: room.size_m2 ? `${room.size_m2} m²` : "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
                      <p className={`text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm font-semibold mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {amenities.length > 0
                      ? amenities.map((a) => (
                          <span key={a} className={`px-2.5 py-1 rounded-md text-xs font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                            {a}
                          </span>
                        ))
                      : <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>No amenities registered</span>
                    }
                  </div>
                </div>

                {/* Room units */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">
                      Room units
                      {units.length > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                          {units.length}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Error msg */}
                  {errorMsg && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
                      {errorMsg}
                      <button className="ml-2 underline" onClick={() => setErrorMsg("")}>dismiss</button>
                    </div>
                  )}

                  {/* Loading spinner */}
                  {loadingUnits && (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Grid de units */}
                  {!loadingUnits && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {units.map((unit) => {
                          const st = unit.status || "available";
                          return (
                            <div
                              key={unit.id}
                              data-unit-menu
                              className={`rounded-xl border p-3 transition-opacity ${c(cardBg, st, isDark)} ${savingUnit === unit.id ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className={`text-lg font-bold ${c(numColor, st, isDark)}`}>
                                    {unit.unit_number}
                                    {savingUnit === unit.id && (
                                      <span className="ml-2 inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin align-middle" />
                                    )}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${c(statusText, st, isDark)}`}>
                                    {STATUS_OPTIONS.find((s) => s.value === st)?.label || st}
                                  </p>
                                  {unit.notes && (
                                    <p className={`text-xs mt-1 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                      📝 {unit.notes}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {/* Botón eliminar */}
                                 

                                  {/* Menú de estado */}
                                  <div className="relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenu((prev) => prev === unit.id ? null : unit.id);
                                      }}
                                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${c(menuBtn, st, isDark)}`}
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5"  r="1.5" />
                                        <circle cx="12" cy="12" r="1.5" />
                                        <circle cx="12" cy="19" r="1.5" />
                                      </svg>
                                    </button>

                                    {openMenu === unit.id && (
                                      <div className={`absolute right-0 top-11 z-30 w-44 rounded-xl border p-2 ${isDark ? "bg-slate-800 border-slate-700 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
                                        {STATUS_OPTIONS.map((opt) => (
                                          <button
                                            key={opt.value}
                                            onClick={() => handleStatusChange(unit, opt.value)}
                                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                                              unit.status === opt.value
                                                ? isDark ? "bg-slate-700 text-slate-100" : "bg-slate-100 text-slate-800"
                                                : isDark ? "text-slate-200 hover:bg-slate-700/70" : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                          >
                                            <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                                            {opt.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {!units.length && (
                          <p className={`col-span-2 text-sm py-4 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            No units found. Add one below.
                          </p>
                        )}
                      </div>

                      {/* ── Agregar unidad ─────────────────── */}
                      <div className={`mt-4 flex gap-2 p-3 rounded-xl border ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}>
                        <input
                          type="text"
                          value={newUnitNum}
                          onChange={(e) => { setNewUnitNum(e.target.value); setErrorMsg(""); }}
                          onKeyDown={(e) => { if (e.key === "Enter") handleAddUnit(); }}
                          placeholder="Unit number (e.g. 301)"
                          className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none border transition-colors ${
                            isDark
                              ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500"
                              : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500"
                          }`}
                        />
                        <button
                          onClick={handleAddUnit}
                          disabled={addingUnit || !newUnitNum.trim()}
                          className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
                        >
                          {addingUnit
                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Plus className="w-4 h-4" />
                          }
                          Add
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            

            {/* ════ TAB: ACTIONS ════ */}
            {activeTab === "actions" && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { if (onEdit) onEdit(room); onClose(); }}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Edit Room
                </button>
                <button
                  onClick={() => { if (onDelete) onDelete(room.id); onClose(); }}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  Delete Room
                </button>
              </div>
            )}
          </div>

          {/*  Footer */}
          <div className={`px-6 py-3 border-t flex-shrink-0 flex justify-end ${isDark ? "border-slate-700/50 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomModal;
