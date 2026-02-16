import React, { useState } from "react";
import { BarChart3, Calendar, Clock, Star } from "lucide-react";
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
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import {
  reportsKPIs,
  dailyOccupancyData,
  guestsByCountry,
  guestTypeData,
  roomPerformance,
  maintenanceData,
} from "./data/mockDashboardData";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// ============================================
// CUSTOM TOOLTIPS PARA RECHARTS (Definidos fuera del componente)
// ============================================
const OccupancyTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg p-3 shadow-lg border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        <p className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}>
          {payload[0].payload.date}
        </p>
        <p className="text-blue-600 font-semibold mt-1">
          {payload[0].value}% occupancy
        </p>
      </div>
    );
  }
  return null;
};

const CountryTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg p-3 shadow-lg border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        <p className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}>
          {payload[0].payload.country}
        </p>
        <p className="text-emerald-600 font-semibold mt-1">
          {payload[0].value} guests
        </p>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {payload[0].payload.percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

const ReportsPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Mapear iconos
  const iconMap = {
    BarChart3,
    Calendar,
    Clock,
    Star,
  };

  // ============================================
  // CONFIGURACIÓN GRÁFICO PIE (Chart.js)
  // ============================================
  const guestTypePieData = {
    labels: guestTypeData.labels,
    datasets: [
      {
        data: guestTypeData.values,
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
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
          label: (context) => {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
            Reports
          </h1>
          <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
            Detailed analytics and performance metrics.
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {["7days", "30days", "90days", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {period === "7days"
                ? "7D"
                : period === "30days"
                ? "30D"
                : period === "90days"
                ? "90D"
                : "1Y"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {reportsKPIs.map((card) => {
          const IconComponent = iconMap[card.icon];
          return (
            <article
              key={card.title}
              className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${
                isDark ? card.dark : card.light
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`font-bold mb-1 ${card.iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}
                  >
                    {card.value}
                  </p>
                  <p
                    className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg ${card.iconWrap} flex items-center justify-center`}
                >
                  <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Occupancy Trend */}
      <div
        className={`rounded-xl p-5 mb-5 ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <h3 className="font-semibold text-lg mb-4">Daily Occupancy Rate</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyOccupancyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
            />
            <YAxis
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<OccupancyTooltip isDark={isDark} />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Guests by Country */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Guests by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={guestsByCountry}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#e2e8f0"}
              />
              <XAxis
                dataKey="country"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
              />
              <YAxis
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
              />
              <Tooltip content={<CountryTooltip isDark={isDark} />} />
              <Bar dataKey="guests" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Guest Type Distribution */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Guest Type Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={guestTypePieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Maintenance Trend */}
      <div
        className={`rounded-xl p-5 mb-6 ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <h3 className="font-semibold text-lg mb-4">Monthly Maintenance Log</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={maintenanceData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
            />
            <YAxis
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Room Performance Table */}
      <div
        className={`rounded-xl overflow-hidden ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <div
          className={`px-4 sm:px-5 py-4 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className="font-semibold text-[clamp(1rem,0.9rem+0.45vw,1.25rem)]">
            Top Performing Rooms
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="block lg:hidden p-4 space-y-3">
          {roomPerformance.map((room, index) => (
            <div
              key={room.room}
              className={`rounded-lg border p-4 ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    #{index + 1} {room.room}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {room.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">
                    ${room.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-600 flex items-center gap-1 justify-end mt-1">
                    <Star className="w-3 h-3 fill-current" />
                    {room.rating}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs space-y-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <p>📅 {room.occupancyDays} days occupied</p>
                <p>💰 Avg rate: ${room.avgRate}/night</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead
              className={`text-xs font-medium ${
                isDark ? "bg-slate-800/50" : "bg-slate-50"
              }`}
            >
              <tr>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Rank
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Room
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Type
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Revenue
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Occupancy
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Avg Rate
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {roomPerformance.map((room, index) => (
                <tr
                  key={room.room}
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{room.room}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{room.type}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-emerald-600">
                      ${room.revenue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{room.occupancyDays} days</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">${room.avgRate}/night</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm flex items-center gap-1 text-amber-600">
                      <Star className="w-4 h-4 fill-current" />
                      {room.rating}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ReportsPage;
