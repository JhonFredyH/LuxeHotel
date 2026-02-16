// ============================================
// DATOS PARA DASHBOARD
// ============================================

export const dashboardKPIs = [
  {
    title: "TODAY'S REVENUE",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: "DollarSign",
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "OCCUPANCY RATE",
    value: "78%",
    change: "+5.2%",
    trend: "up",
    icon: "Home",
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "CHECK-INS TODAY",
    value: "23",
    change: "8 pending",
    trend: "neutral",
    icon: "LogIn",
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    title: "ACTIVE GUESTS",
    value: "156",
    change: "-3 vs yesterday",
    trend: "down",
    icon: "Users",
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  }
];

// Ingresos últimos 30 días
export const revenueData = [
  { date: "Jan 15", revenue: 8500 },
  { date: "Jan 16", revenue: 9200 },
  { date: "Jan 17", revenue: 7800 },
  { date: "Jan 18", revenue: 10500 },
  { date: "Jan 19", revenue: 11200 },
  { date: "Jan 20", revenue: 9800 },
  { date: "Jan 21", revenue: 8900 },
  { date: "Jan 22", revenue: 12400 },
  { date: "Jan 23", revenue: 13100 },
  { date: "Jan 24", revenue: 11800 },
  { date: "Jan 25", revenue: 10200 },
  { date: "Jan 26", revenue: 9500 },
  { date: "Jan 27", revenue: 8700 },
  { date: "Jan 28", revenue: 14200 },
  { date: "Jan 29", revenue: 15600 },
  { date: "Jan 30", revenue: 13900 },
  { date: "Jan 31", revenue: 12100 },
  { date: "Feb 1", revenue: 10800 },
  { date: "Feb 2", revenue: 9900 },
  { date: "Feb 3", revenue: 11500 },
  { date: "Feb 4", revenue: 12700 },
  { date: "Feb 5", revenue: 13400 },
  { date: "Feb 6", revenue: 14100 },
  { date: "Feb 7", revenue: 12900 },
  { date: "Feb 8", revenue: 11200 },
  { date: "Feb 9", revenue: 10600 },
  { date: "Feb 10", revenue: 13800 },
  { date: "Feb 11", revenue: 15200 },
  { date: "Feb 12", revenue: 14500 },
  { date: "Feb 13", revenue: 12450 },
];

// Ocupación por tipo de habitación
export const occupancyByRoomType = [
  { type: "Standard", occupied: 45, total: 101, rate: 44.6 },
  { type: "Deluxe", occupied: 28, total: 50, rate: 56.0 },
  { type: "Suite", occupied: 18, total: 30, rate: 60.0 },
  { type: "Premium", occupied: 25, total: 40, rate: 62.5 },
  { type: "Presidencial", occupied: 8, total: 10, rate: 80.0 },
];

// Estados de habitaciones (para gráfico Donut)
export const roomStatusData = {
  available: 24,
  occupied: 156,
  maintenance: 8,
  cleaning: 12,
};

// ============================================
// DATOS PARA FINANCIAL
// ============================================

export const financialKPIs = [
  {
    title: "MONTHLY REVENUE",
    value: "$342,580",
    change: "+18.3%",
    trend: "up",
    subtitle: "vs last month",
    icon: "TrendingUp",
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "YEARLY REVENUE",
    value: "$4,120,450",
    change: "+22.1%",
    trend: "up",
    subtitle: "vs last year",
    icon: "DollarSign",
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "AVG. DAILY RATE",
    value: "$185",
    change: "+5.7%",
    trend: "up",
    subtitle: "per room",
    icon: "Calendar",
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    title: "PENDING PAYMENTS",
    value: "$28,340",
    change: "14 invoices",
    trend: "neutral",
    subtitle: "to collect",
    icon: "AlertCircle",
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  }
];

// Evolución mensual del año (enero - diciembre)
export const monthlyRevenueData = [
  { month: "Jan", revenue: 285000, expenses: 145000, profit: 140000 },
  { month: "Feb", revenue: 295000, expenses: 148000, profit: 147000 },
  { month: "Mar", revenue: 310000, expenses: 152000, profit: 158000 },
  { month: "Apr", revenue: 325000, expenses: 155000, profit: 170000 },
  { month: "May", revenue: 340000, expenses: 160000, profit: 180000 },
  { month: "Jun", revenue: 380000, expenses: 170000, profit: 210000 },
  { month: "Jul", revenue: 420000, expenses: 185000, profit: 235000 },
  { month: "Aug", revenue: 410000, expenses: 182000, profit: 228000 },
  { month: "Sep", revenue: 365000, expenses: 165000, profit: 200000 },
  { month: "Oct", revenue: 350000, expenses: 162000, profit: 188000 },
  { month: "Nov", revenue: 338000, expenses: 158000, profit: 180000 },
  { month: "Dec", revenue: 342580, expenses: 160000, profit: 182580 },
];

// Ingresos por tipo de habitación
export const revenueByRoomType = [
  { type: "Standard", revenue: 124500, percentage: 28 },
  { type: "Deluxe", revenue: 156800, percentage: 35 },
  { type: "Suite", revenue: 98200, percentage: 22 },
  { type: "Premium", revenue: 45600, percentage: 10 },
  { type: "Presidencial", revenue: 22400, percentage: 5 },
];

// Métodos de pago
export const paymentMethodsData = {
  labels: ["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Digital Wallet"],
  values: [45, 28, 12, 10, 5], // porcentajes
};

// Pagos pendientes (tabla)
export const pendingPayments = [
  { 
    id: 1, 
    guest: "María García", 
    room: "301", 
    amount: 2500, 
    dueDate: "Feb 15, 2026",
    status: "overdue" 
  },
  { 
    id: 2, 
    guest: "Juan Pérez", 
    room: "205", 
    amount: 3200, 
    dueDate: "Feb 18, 2026",
    status: "pending" 
  },
  { 
    id: 3, 
    guest: "Ana Martínez", 
    room: "102", 
    amount: 1800, 
    dueDate: "Feb 20, 2026",
    status: "pending" 
  },
  { 
    id: 4, 
    guest: "Carlos Rodríguez", 
    room: "410", 
    amount: 4500, 
    dueDate: "Feb 22, 2026",
    status: "pending" 
  },
  { 
    id: 5, 
    guest: "Laura Sánchez", 
    room: "203", 
    amount: 2100, 
    dueDate: "Feb 25, 2026",
    status: "pending" 
  },
];

// ============================================
// DATOS PARA REPORTS
// ============================================

export const reportsKPIs = [
  {
    title: "AVG. OCCUPANCY RATE",
    value: "73.2%",
    change: "+8.4%",
    trend: "up",
    subtitle: "last 30 days",
    icon: "BarChart3",
    light: "bg-white border-2 border-emerald-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30",
    iconWrap: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "TOTAL BOOKINGS",
    value: "1,248",
    change: "+15.2%",
    trend: "up",
    subtitle: "this month",
    icon: "Calendar",
    light: "bg-white border-2 border-blue-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30",
    iconWrap: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "AVG. STAY DURATION",
    value: "3.4 days",
    change: "+0.3 days",
    trend: "up",
    subtitle: "per booking",
    icon: "Clock",
    light: "bg-white border-2 border-purple-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30",
    iconWrap: "bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    title: "GUEST SATISFACTION",
    value: "4.7/5",
    change: "+0.2",
    trend: "up",
    subtitle: "avg. rating",
    icon: "Star",
    light: "bg-white border-2 border-amber-200 shadow-sm hover:shadow-md",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30",
    iconWrap: "bg-amber-500/20",
    iconColor: "text-amber-600",
  }
];

// Tasa de ocupación diaria (últimos 30 días)
export const dailyOccupancyData = [
  { date: "Jan 15", rate: 68 },
  { date: "Jan 16", rate: 72 },
  { date: "Jan 17", rate: 65 },
  { date: "Jan 18", rate: 75 },
  { date: "Jan 19", rate: 78 },
  { date: "Jan 20", rate: 82 },
  { date: "Jan 21", rate: 80 },
  { date: "Jan 22", rate: 76 },
  { date: "Jan 23", rate: 73 },
  { date: "Jan 24", rate: 70 },
  { date: "Jan 25", rate: 68 },
  { date: "Jan 26", rate: 71 },
  { date: "Jan 27", rate: 74 },
  { date: "Jan 28", rate: 77 },
  { date: "Jan 29", rate: 81 },
  { date: "Jan 30", rate: 79 },
  { date: "Jan 31", rate: 75 },
  { date: "Feb 1", rate: 72 },
  { date: "Feb 2", rate: 69 },
  { date: "Feb 3", rate: 73 },
  { date: "Feb 4", rate: 76 },
  { date: "Feb 5", rate: 78 },
  { date: "Feb 6", rate: 80 },
  { date: "Feb 7", rate: 77 },
  { date: "Feb 8", rate: 74 },
  { date: "Feb 9", rate: 71 },
  { date: "Feb 10", rate: 75 },
  { date: "Feb 11", rate: 79 },
  { date: "Feb 12", rate: 76 },
  { date: "Feb 13", rate: 73 },
];

// Huéspedes por país/región
export const guestsByCountry = [
  { country: "Colombia", guests: 456, percentage: 45 },
  { country: "USA", guests: 234, percentage: 23 },
  { country: "Spain", guests: 123, percentage: 12 },
  { country: "Mexico", guests: 89, percentage: 9 },
  { country: "Argentina", guests: 67, percentage: 7 },
  { country: "Others", guests: 45, percentage: 4 },
];

// Tipo de huéspedes (nuevos vs recurrentes)
export const guestTypeData = {
  labels: ["Recurring Guests", "New Guests"],
  values: [65, 35], // porcentajes
};

// Performance de habitaciones (ranking)
export const roomPerformance = [
  { 
    room: "301 - Presidencial", 
    type: "Presidencial",
    revenue: 45600, 
    occupancyDays: 28, 
    avgRate: 520,
    rating: 4.9 
  },
  { 
    room: "205 - Premium", 
    type: "Premium",
    revenue: 38200, 
    occupancyDays: 26, 
    avgRate: 350,
    rating: 4.8 
  },
  { 
    room: "102 - Deluxe", 
    type: "Deluxe",
    revenue: 32400, 
    occupancyDays: 27, 
    avgRate: 280,
    rating: 4.7 
  },
  { 
    room: "410 - Suite", 
    type: "Suite",
    revenue: 28900, 
    occupancyDays: 25, 
    avgRate: 380,
    rating: 4.6 
  },
  { 
    room: "203 - Standard", 
    type: "Standard",
    revenue: 18600, 
    occupancyDays: 29, 
    avgRate: 120,
    rating: 4.5 
  },
];

// Mantenimientos por mes
export const maintenanceData = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 8 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 10 },
  { month: "May", count: 9 },
  { month: "Jun", count: 14 },
  { month: "Jul", count: 11 },
  { month: "Aug", count: 13 },
  { month: "Sep", count: 7 },
  { month: "Oct", count: 10 },
  { month: "Nov", count: 12 },
  { month: "Dec", count: 9 },
];
