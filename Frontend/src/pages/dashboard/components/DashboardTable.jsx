import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const PAGE_SIZE = 5;

// Mapeo de status del backend → etiqueta visual
const STATUS_MAP = {
  confirmed: "Confirmed",
  pending: "Pending",
  checked_in: "Check-in Today",
  checked_out: "Check-out Today",
  cancelled: "Cancelled",
};

const FILTER_TABS = [
  { key: "all",         label: "All" },
  { key: "confirmed",   label: "Confirmed" },
  { key: "pending",     label: "Pending" },
  { key: "checked_in",  label: "Check-in Today" },
  { key: "checked_out", label: "Check-out Today" },
];

const DataTable = ({ isDark, statusClass, onRowClick }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const [data, setData]                 = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ── Fetch desde la API ─────────────────────────────────────
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
          ...(activeFilter !== "all" && { status: activeFilter }),
        });

        const token = localStorage.getItem("token") || localStorage.getItem("guest_token");
        const res = await fetch(`${API_URL}/reservations?${params}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();

        // El endpoint debe devolver { data: [...], total: N }
        setData(json.data ?? json);
        setTotal(json.total ?? (json.data ?? json).length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [activeFilter, page]);

  // Resetear a página 1 al cambiar filtro
  const handleFilter = (key) => {
    setActiveFilter(key);
    setPage(1);
  };

  // Helpers
  const initials = (r) => {
    const name = r.guest_name ?? `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim();
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const guestName = (r) =>
    r.guest_name ?? `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim();

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const statusLabel = (r) =>
    STATUS_MAP[r.status] ?? r.status ?? "—";

  const total$ = (r) =>
    r.total_price != null
      ? `$${Number(r.total_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : r.total ?? "—";

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="hidden md:block">

      {/* Filter Tabs */}
      <div className={`flex gap-1 px-4 pt-3 pb-0 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilter(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeFilter === tab.key
                ? isDark
                  ? "bg-slate-700 text-emerald-400 border-b-2 border-emerald-400"
                  : "bg-white text-emerald-700 border-b-2 border-emerald-600"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3">
          <svg className="animate-spin h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading reservations...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex justify-center py-16">
          <p className="text-sm text-red-500">⚠️ {error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data.length === 0 && (
        <div className="flex justify-center py-16">
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            No reservations found.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
                {["Guest", "Room", "Check-in", "Check-out", "Status", "Total", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b transition-colors cursor-pointer ${
                    isDark ? "border-slate-700 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"
                  }`}
                  onClick={() => onRowClick(item)}
                >
                  {/* Guest */}
                  <td className="py-3.5 px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {initials(item)}
                      </div>
                      <span className="font-medium text-[clamp(0.8rem,0.75rem+0.25vw,0.93rem)]">
                        {guestName(item)}
                      </span>
                    </div>
                  </td>

                  {/* Room */}
                  <td className={`py-3.5 px-4 lg:px-6 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {item.room_number ?? item.room ?? "—"}
                    {item.room_type && (
                      <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {item.room_type}
                      </p>
                    )}
                  </td>

                  {/* Check-in */}
                  <td className={`py-3.5 px-4 lg:px-6 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {formatDate(item.check_in_date ?? item.checkIn)}
                  </td>

                  {/* Check-out */}
                  <td className={`py-3.5 px-4 lg:px-6 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {formatDate(item.check_out_date ?? item.checkOut)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 lg:px-6">
                    <span className={`inline-flex items-center justify-center w-[8.5rem] px-3 py-1.5 rounded-lg font-semibold text-[clamp(0.67rem,0.63rem+0.16vw,0.78rem)] ${statusClass(statusLabel(item))}`}>
                      {statusLabel(item)}
                    </span>
                  </td>

                  {/* Total */}
                  <td className={`py-3.5 px-4 lg:px-6 font-semibold text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                    {total$(item)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 lg:px-6" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onRowClick(item)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-xs ${
                        isDark
                          ? "border border-slate-700 hover:bg-slate-700 text-slate-300"
                          : "border border-slate-300 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────── */}
      {!loading && !error && totalPages > 1 && (
        <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Showing{" "}
            <span className="font-semibold">{(page - 1) * PAGE_SIZE + 1}</span>
            {" "}–{" "}
            <span className="font-semibold">{Math.min(page * PAGE_SIZE, total)}</span>
            {" "}of{" "}
            <span className="font-semibold">{total}</span> reservations
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className={`px-2 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === p
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isDark
                          ? "hover:bg-slate-700 text-slate-300"
                          : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
