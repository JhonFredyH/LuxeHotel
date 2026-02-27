import React, { useState, useEffect, useCallback } from "react";
import { Users, Mail } from "lucide-react";
import GuestDetailModal from "./modal/GuestDetailModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const PAGE_SIZE = 5;

const token   = () => localStorage.getItem("token");
const authHdr = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

const GuestsPage = ({ theme, searchQuery = "" }) => {
  const isDark = theme.pageText.includes("text-white");

  const [guests, setGuests]               = useState([]);
  const [total, setTotal]                 = useState(0);
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [detailOpen, setDetailOpen]       = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [inviting, setInviting]           = useState(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchGuests = useCallback(async (currentPage, search) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page:  currentPage,
        limit: PAGE_SIZE,
        ...(search ? { search } : {}),
      });
      const res  = await fetch(`${API_URL}/guests?${params}`, { headers: authHdr() });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setGuests(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Single effect handles both page navigation and search changes
  useEffect(() => {
    fetchGuests(page, searchQuery);
  }, [page, searchQuery, fetchGuests]); 

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleViewDetails = (guest) => {
    setSelectedGuest(guest);
    setDetailOpen(true);
  };

  const handleEditGuest = (guest) => {
    setDetailOpen(false);
    setSelectedGuest(guest);
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      const res = await fetch(`${API_URL}/guests/${guestId}`, {
        method: "DELETE",
        headers: authHdr(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.detail || `Error ${res.status}`);
        return;
      }
      setDetailOpen(false);
      fetchGuests(page, searchQuery);
    } catch {
      alert("Connection error while deleting guest.");
    }
  };

  // Invite guest to register — placeholder until email endpoint exists
  const handleInvite = async (e, guest) => {
    e.stopPropagation();
    setInviting(guest.id);
    await new Promise((r) => setTimeout(r, 800)); // replace with real API call
    alert(`Invitation sent to ${guest.email}`);
    setInviting(null);
  };

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const pageNumbers = () => {
    const pages = [];
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
      pages.push(i);
    }
    return pages;
  };

  const cellCls = "px-4 py-3 text-sm";
  const thCls   = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">Guests</h1>
        <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
          Guest directory — click any row to view details and reservation history.
        </p>
      </div>

      {/* Summary bar */}
      <div className={`flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <Users className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
        {loading
          ? <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading…</span>
          : <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <strong>{total}</strong> guest{total !== 1 ? "s" : ""} registered
              {searchQuery && <span className="ml-1 text-blue-500">· filtering by "{searchQuery}"</span>}
            </span>
        }
      </div>

      {/* Table card */}
      <div className={`rounded-xl overflow-hidden ${isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200 shadow-sm"}`}>

        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading guests…</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-red-500">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && guests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users className={`w-10 h-10 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {searchQuery ? `No guests found for "${searchQuery}"` : "No guests registered yet."}
            </p>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && !error && guests.length > 0 && (
          <div className="block md:hidden p-4 space-y-3">
            {guests.map((guest) => (
              <div
                key={guest.id}
                onClick={() => handleViewDetails(guest)}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{guest.first_name} {guest.last_name}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{guest.email}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>📞 {guest.phone || "—"}</p>
                  </div>
                  {!guest.password_hash && (
                    <button
                      onClick={(e) => handleInvite(e, guest)}
                      disabled={inviting === guest.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      <Mail className="w-3 h-3" />
                      Invite
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && guests.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? "bg-slate-800/70" : "bg-slate-50"}>
                <tr>
                  <th className={thCls}>Guest</th>
                  <th className={thCls}>Email</th>
                  <th className={thCls}>Phone</th>
                  <th className={thCls}>Joined</th>
                  <th className={thCls}>Account</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    onClick={() => handleViewDetails(guest)}
                    className={`cursor-pointer transition-colors ${isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                  >
                    <td className={cellCls}>
                      <p className="font-medium">{guest.first_name} {guest.last_name}</p>
                    </td>

                    <td className={`${cellCls} ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {guest.email}
                    </td>

                    <td className={`${cellCls} ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {guest.phone || "—"}
                    </td>

                    <td className={`${cellCls} text-xs ${isDark ? "text-slate-400" : "text-slate-400"}`}>
                      {new Date(guest.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>

                    {/* Registered = has password. No account = show Invite button */}
                    <td className={cellCls} onClick={(e) => e.stopPropagation()}>
                      {guest.password_hash ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Registered
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleInvite(e, guest)}
                          disabled={inviting === guest.id}
                          title="Send account invitation email"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          {inviting === guest.id
                            ? <span className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                            : <Mail className="w-3 h-3" />
                          }
                          Invite
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
              >
                ← Prev
              </button>

              {page > 2 && (
                <>
                  <button onClick={() => goTo(1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>1</button>
                  {page > 3 && <span className={`text-xs px-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>…</span>}
                </>
              )}

              {pageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}

              {page < totalPages - 1 && (
                <>
                  {page < totalPages - 2 && <span className={`text-xs px-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>…</span>}
                  <button onClick={() => goTo(totalPages)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>{totalPages}</button>
                </>
              )}

              <button
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      <GuestDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        guest={selectedGuest}
        theme={theme}
        onEdit={handleEditGuest}
        onDelete={handleDeleteGuest}
      />
    </section>
  );
};

export default GuestsPage;
