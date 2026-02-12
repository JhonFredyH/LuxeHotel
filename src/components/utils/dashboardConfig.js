export const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "reservas", label: "Reservations", icon: "CalendarCheck" },
  { id: "habitaciones", label: "Rooms", icon: "BedDouble" },
  { id: "huespedes", label: "Guest", icon: "Users" },
  { id: "finanzas", label: "Financial", icon: "DollarSign" },
  { id: "reportes", label: "Reports", icon: "FileText" },
  { id: "configuracion", label: "Settings", icon: "Settings" },
];

export const getTheme = (darkMode) =>
  darkMode
    ? {
        app: "bg-slate-950",
        sidebar:
          "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-r border-slate-800",
        sidebarTitle: "text-white",
        sidebarSub: "text-slate-400",
        sidebarItem: "text-slate-300 hover:bg-white/5",
        sidebarItemText: "text-slate-300",
        main: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
        topbar: "bg-slate-900/70 border-slate-800",
        control: "text-slate-300 hover:bg-slate-800",
        search:
          "bg-slate-800 text-white placeholder-slate-400 border-slate-700",
        pageText: "text-white",
        pageSub: "text-slate-400",
        content: "border-slate-700 bg-slate-900/40",
        contentIcon: "bg-slate-800 text-slate-500",
        contentText: "text-slate-400",
        dropdown: "bg-slate-900 border-slate-700 text-slate-200",
        dropdownItem: "hover:bg-slate-800",
      }
    : {
        app: "bg-slate-100",
        sidebar:
          "bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-slate-200",
        sidebarTitle: "text-slate-900",
        sidebarSub: "text-slate-500",
        sidebarItem: "text-slate-700 hover:bg-slate-200/60",
        sidebarItemText: "text-slate-700",
        main: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        topbar: "bg-white/80 border-slate-200",
        control: "text-slate-700 hover:bg-slate-100",
        search:
          "bg-white text-slate-800 placeholder-slate-500 border-slate-300",
        pageText: "text-slate-900",
        pageSub: "text-slate-600",
        content: "border-slate-300 bg-white/70",
        contentIcon: "bg-slate-200 text-slate-400",
        contentText: "text-slate-500",
        dropdown: "bg-white border-slate-200 text-slate-700",
        dropdownItem: "hover:bg-slate-100",
      };

export const BRAND_CONFIG = {
  name: "LUXE BOUTIQUE",
  tagline: "RESORT",
  href: "/",
  ariaLabel: "Luxe Boutique Resort - Home",
};
