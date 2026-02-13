import React from "react";
import { TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react";
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
  financialKPIs,
  monthlyRevenueData,
  revenueByRoomType,
  paymentMethodsData,
  pendingPayments,
} from "./data/mockDashboardData";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// ============================================
// CUSTOM TOOLTIPS PARA RECHARTS (Definidos fuera del componente)
// ============================================
const MonthlyTooltip = ({ active, payload, isDark }) => {
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
          {payload[0].payload.month}
        </p>
        <p className="text-emerald-600 font-semibold mt-1">
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
        {payload[1] && (
          <p className="text-red-600 font-semibold">
            Expenses: ${payload[1].value.toLocaleString()}
          </p>
        )}
        {payload[2] && (
          <p className="text-blue-600 font-semibold">
            Profit: ${payload[2].value.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const RoomRevenueTooltip = ({ active, payload, isDark }) => {
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
        <p className="text-emerald-600 font-semibold mt-1">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {payload[0].payload.percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

const FinancialPage = ({ theme }) => {
  const isDark = theme.pageText.includes("text-white");

  // Mapear iconos
  const iconMap = {
    TrendingUp,
    DollarSign,
    Calendar,
    AlertCircle,
  };

  // ============================================
  // CONFIGURACIÓN GRÁFICO PIE (Chart.js)
  // ============================================
  const pieData = {
    labels: paymentMethodsData.labels,
    datasets: [
      {
        data: paymentMethodsData.values,
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
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
        position: "right",
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
      <div className="mb-6 md:mb-8">
        <h1 className="font-light leading-tight text-[clamp(1.35rem,1.1rem+1.2vw,2rem)]">
          Financial
        </h1>
        <p className={`mt-1 text-[clamp(0.8rem,0.74rem+0.24vw,0.95rem)] ${theme.pageSub}`}>
          Revenue analysis and financial reports.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {financialKPIs.map((card) => {
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

      {/* Monthly Revenue Evolution */}
      <div
        className={`rounded-xl p-5 mb-5 ${
          isDark
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        <h3 className="font-semibold text-lg mb-4">Monthly Revenue Evolution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyRevenueData}>
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<MonthlyTooltip isDark={isDark} />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
                color: isDark ? "#cbd5e1" : "#475569",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue by Room Type */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Revenue by Room Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByRoomType} layout="horizontal">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#e2e8f0"}
              />
              <XAxis
                type="number"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: isDark ? "#475569" : "#cbd5e1" }}
              />
              <Tooltip content={<RoomRevenueTooltip isDark={isDark} />} />
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div
          className={`rounded-xl p-5 ${
            isDark
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Payment Methods Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Pending Payments Table */}
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
            Pending Payments
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden p-4 space-y-3">
          {pendingPayments.map((payment) => (
            <div
              key={payment.id}
              className={`rounded-lg border p-4 ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{payment.guest}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Room {payment.room}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    payment.status === "overdue"
                      ? isDark
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-red-100 text-red-700 border border-red-200"
                      : isDark
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {payment.status === "overdue" ? "Overdue" : "Pending"}
                </span>
              </div>
              <div
                className={`text-sm space-y-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <p className="font-semibold text-emerald-600">
                  ${payment.amount.toLocaleString()}
                </p>
                <p>Due: {payment.dueDate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                  Guest
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
                  Amount
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Due Date
                </th>
                <th
                  className={`px-4 py-3 text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {pendingPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{payment.guest}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{payment.room}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-emerald-600">
                      ${payment.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{payment.dueDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${
                        payment.status === "overdue"
                          ? isDark
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-red-100 text-red-700 border border-red-200"
                          : isDark
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {payment.status === "overdue" ? "Overdue" : "Pending"}
                    </span>
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

export default FinancialPage;
