import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, Home, LogIn, Users } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("guest_token");

const authHeader = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── KPI config ───────────────────────────────────────────────
const KPI_CONFIG = [
  {
    key: "revenue",
    title: "TODAY'S REVENUE",
    icon: DollarSign,
    format: (v) =>
      `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    key: "occupancy",
    title: "OCCUPANCY RATE",
    icon: Home,
    format: (v) => `${Number(v).toFixed(1)}%`,
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    key: "checkins_today",
    title: "CHECK-INS TODAY",
    icon: LogIn,
    format: (v) => String(v),
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    key: "active_guests",
    title: "ACTIVE GUESTS",
    icon: Users,
    format: (v) => String(v),
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  },
];

// ── Custom Tooltips ──────────────────────────────────────────
const RevenueTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className={`rounded-lg p-3 shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <p
        className={`font-medium text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}
      >
        {payload[0].payload.date}
      </p>
      <p className="text-emerald-600 font-semibold mt-1">
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

const OccupancyTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className={`rounded-lg p-3 shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <p
        className={`font-medium text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}
      >
        {payload[0].payload.type}
      </p>
      <p className="text-blue-600 font-semibold mt-1">
        {payload[0].value}% occupied
      </p>
      <p
        className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
      >
        {payload[0].payload.occupied}/{payload[0].payload.total} rooms
      </p>
    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <span
    className={`inline-block rounded animate-pulse bg-slate-200 ${className}`}
  />
);

const DashboardPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");

  const [kpis, setKpis] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [roomStatus, setRoomStatus] = useState({
    available: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
  });
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes, roomsRes, reservationsRes] =
        await Promise.all([
          fetch(`${API_URL}/dashboard/stats`, { headers: authHeader() }),
          fetch(`${API_URL}/dashboard/revenue`, { headers: authHeader() }),
          fetch(`${API_URL}/rooms?limit=100&is_active=true`, {
            headers: authHeader(),
          }),
          fetch(`${API_URL}/reservations?limit=100`, { headers: authHeader() }),
        ]);

      // ── KPIs ──────────────────────────────────────────────
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setKpis(stats);
      } else {
        // Calcular KPIs desde otros endpoints si /dashboard/stats no existe
        const [rooms, reservations] = await Promise.all([
          roomsRes.ok ? roomsRes.json() : { data: [], total: 0 },
          reservationsRes.ok ? reservationsRes.json() : { data: [], total: 0 },
        ]);

        const roomList = rooms.data ?? [];
        const resList = reservations.data ?? [];
        const today = new Date().toISOString().split("T")[0];

        const occupied = roomList.filter((r) => r.status === "occupied").length;
        const total = roomList.length || 1;
        const occupancy = ((occupied / total) * 100).toFixed(1);

        const todayRevenue = resList
          .filter((r) => r.check_in_date === today)
          .reduce((sum, r) => sum + (r.total_price ?? 0), 0);

        const checkinsToday = resList.filter(
          (r) => r.check_in_date === today,
        ).length;
        const activeGuests = resList.filter(
          (r) => r.status === "confirmed" || r.status === "checked_in",
        ).length;

        setKpis({
          revenue: todayRevenue,
          occupancy: occupancy,
          checkins_today: checkinsToday,
          active_guests: activeGuests,
        });

        // Room status desde la lista
        setRoomStatus({
          available: roomList.filter(
            (r) => r.status === "available" || r.is_active,
          ).length,
          occupied: occupied,
          maintenance: roomList.filter((r) => r.status === "maintenance")
            .length,
          cleaning: roomList.filter((r) => r.status === "cleaning").length,
        });

        // Occupancy by room type
        const byType = {};
        roomList.forEach((r) => {
          const type = r.name ?? r.slug ?? "Unknown";
          if (!byType[type]) byType[type] = { type, occupied: 0, total: 0 };
          byType[type].total++;
          if (r.status === "occupied") byType[type].occupied++;
        });
        setOccupancyData(
          Object.values(byType).map((t) => ({
            ...t,
            rate: t.total > 0 ? +((t.occupied / t.total) * 100).toFixed(1) : 0,
          })),
        );
      }

      // ── Revenue chart ──────────────────────────────────────
      if (revenueRes.ok) {
        const rev = await revenueRes.json();
        setRevenueData(rev.data ?? rev);
      } else {
        // Calcular desde reservaciones si el endpoint no existe
        if (reservationsRes.ok) {
          const res = await reservationsRes.json();
          const resList = res.data ?? [];
          const byDate = {};
          resList.forEach((r) => {
            const d = r.check_in_date;
            if (!d) return;
            byDate[d] = (byDate[d] ?? 0) + (r.total_price ?? 0);
          });
          const sorted = Object.entries(byDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-30)
            .map(([date, revenue]) => ({
              date: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              revenue: +revenue.toFixed(2),
            }));
          setRevenueData(sorted);
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Doughnut config ──────────────────────────────────────
  const doughnutData = {
    labels: ["Available", "Occupied", "Maintenance", "Cleaning"],
    datasets: [
      {
        data: [
          roomStatus.available,
          roomStatus.occupied,
          roomStatus.maintenance,
          roomStatus.cleaning,
        ],
        backgroundColor: [
          "rgba(16,185,129,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(245,158,11,0.8)",
          "rgba(139,92,246,0.8)",
        ],
        borderColor: [
          "rgba(16,185,129,1)",
          "rgba(59,130,246,1)",
          "rgba(245,158,11,1)",
          "rgba(139,92,246,1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#e2e8f0" : "#475569",
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#0f172a",
        bodyColor: isDark ? "#cbd5e1" : "#475569",
        borderColor: isDark ? "#475569" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const total =
              Object.values(roomStatus).reduce((a, b) => a + b, 0) || 1;
            return `${ctx.label}: ${ctx.parsed} (${((ctx.parsed / total) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
  };

  const cardBg = `rounded-xl p-5 ${isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200 shadow-sm"}`;
  const axisStyle = { fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 };
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const axisColor = isDark ? "#475569" : "#cbd5e1";

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
          Dashboard
        </h1>
        <p
          className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}
        >
          Real-time overview of your hotel operations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {KPI_CONFIG.map((item) => {
          const {
            key,
            title,
            icon: Icon,
            format,
            light,
            dark,
            iconWrap,
            iconColor,
          } = item;

          return (
            <article
              key={key}
              className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${
                isDark ? dark : light
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Text Section */}
                <div>
                  <p
                    className={`font-bold mb-1 ${iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}
                  >
                    {loading || !kpis ? (
                      <Skeleton className="w-16 h-7" />
                    ) : (
                      format(kpis?.[key] ?? 0)
                    )}
                  </p>

                  <p
                    className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {title}
                  </p>
                </div>

                {/* Icon Section */}
                <div
                  className={`w-10 h-10 rounded-lg ${iconWrap} flex items-center justify-center shrink-0`}
                >
                  {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue */}
        <div className={cardBg}>
          <h3 className="font-semibold text-lg mb-4">Revenue Last 30 Days</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : revenueData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                No revenue data yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: axisColor }}
                />
                <YAxis
                  tick={axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: axisColor }}
                  tickFormatter={(v) =>
                    `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <Tooltip content={<RevenueTooltip isDark={isDark} />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Room Status Donut */}
        <div className={cardBg}>
          <h3 className="font-semibold text-lg mb-4">
            Room Status Distribution
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-48 h-48 rounded-full" />
            ) : (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Occupancy by Room Type */}
      <div className={cardBg}>
        <h3 className="font-semibold text-lg mb-4">Occupancy by Room Type</h3>
        {loading ? (
          <Skeleton className="w-full h-[350px]" />
        ) : occupancyData.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center">
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              No occupancy data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="type"
                tick={axisStyle}
                tickLine={false}
                axisLine={{ stroke: axisColor }}
              />
              <YAxis
                tick={axisStyle}
                tickLine={false}
                axisLine={{ stroke: axisColor }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<OccupancyTooltip isDark={isDark} />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                  color: isDark ? "#cbd5e1" : "#475569",
                }}
              />
              <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
