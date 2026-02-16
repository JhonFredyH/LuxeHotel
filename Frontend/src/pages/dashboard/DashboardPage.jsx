import React from "react";
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
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import {
  dashboardKPIs,
  revenueData,
  occupancyByRoomType,
  roomStatusData,
} from "./data/mockDashboardData";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// ============================================
// CUSTOM TOOLTIPS PARA RECHARTS (Definidos fuera del componente)
// ============================================
const CustomTooltip = ({ active, payload, isDark }) => {
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
        <p className="text-emerald-600 font-semibold mt-1">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

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
          {payload[0].payload.type}
        </p>
        <p className="text-blue-600 font-semibold mt-1">
          {payload[0].value}% occupied
        </p>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {payload[0].payload.occupied}/{payload[0].payload.total} rooms
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");

  // Mapear iconos
  const iconMap = {
    DollarSign,
    Home,
    LogIn,
    Users,
  };

  // ============================================
  // CONFIGURACIÓN GRÁFICO DONUT (Chart.js)
  // ============================================
  const doughnutData = {
    labels: ["Available", "Occupied", "Maintenance", "Cleaning"],
    datasets: [
      {
        data: [
          roomStatusData.available,
          roomStatusData.occupied,
          roomStatusData.maintenance,
          roomStatusData.cleaning,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // verde (available)
          "rgba(59, 130, 246, 0.8)", // azul (occupied)
          "rgba(245, 158, 11, 0.8)", // amarillo (maintenance)
          "rgba(139, 92, 246, 0.8)", // morado (cleaning)
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
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
        displayColors: true,
        callbacks: {
          label: (context) => {
            const total = roomStatusData.available + roomStatusData.occupied + 
                          roomStatusData.maintenance + roomStatusData.cleaning;
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <section className={`max-w-7xl mx-auto ${theme.pageText}`}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
          Dashboard
        </h1>
        <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
          Real-time overview of your hotel operations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {dashboardKPIs.map((card) => {
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
                  <p
                    className={`text-xs mt-1 ${
                      card.trend === "up"
                        ? "text-emerald-600"
                        : card.trend === "down"
                        ? "text-red-600"
                        : isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {card.change}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue Chart */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Revenue Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
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
        </div>

        {/* Room Status Donut */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Room Status Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Occupancy by Room Type */}
      <div
        className={`rounded-xl p-5 ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <h3 className="font-semibold text-lg mb-4">Occupancy by Room Type</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={occupancyByRoomType}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="type"
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
            />
            <YAxis
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
              tickFormatter={(value) => `${value}%`}
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
      </div>
    </section>
  );
};

export default DashboardPage;
