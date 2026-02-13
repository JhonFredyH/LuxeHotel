import { Check, Clock3, LogIn, LogOut } from 'lucide-react';

const kpiIconMap = {
  check: Check,
  clock: Clock3,
  login: LogIn,
  logout: LogOut,
};

const Card = ({ type = 'kpi', data, theme, isDark, statusClass }) => {
  // KPI Card
  if (type === 'kpi') {
    const { title, value, icon, light, dark, iconWrap, iconColor } = data;
    const Icon = kpiIconMap[icon];

    return (
      <article
        className={`rounded-xl p-4 sm:p-5 md:p-6 transition-all hover:scale-[1.01] ${
          isDark ? dark : light
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-bold mb-1 ${iconColor} text-[clamp(1.45rem,1.2rem+1vw,2rem)]`}>
              {value}
            </p>
            <p className={`font-medium text-[clamp(0.78rem,0.72rem+0.2vw,0.9rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {title}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg ${iconWrap} flex items-center justify-center`}>
            {Icon ? <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.2} /> : null}
          </div>
        </div>
      </article>
    );
  }

  // Reservation Card (mobile)
  if (type === 'reservation') {
    const { guest, initials, room, dates, status, total, action } = data;
    return (
      <article
        className={`rounded-lg p-4 border ${
          isDark ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50/70"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate text-[clamp(0.86rem,0.82rem+0.25vw,1rem)]">
                {guest}
              </p>
              <p className={`truncate text-[clamp(0.78rem,0.75rem+0.2vw,0.9rem)] ${theme.pageSub}`}>
                {room}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-[clamp(0.68rem,0.64rem+0.16vw,0.78rem)] font-semibold ${statusClass(status)}`}>
            {status}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className={`text-[clamp(0.76rem,0.72rem+0.2vw,0.86rem)] ${theme.pageSub}`}>
            {dates}
          </p>
          <p className={`font-semibold text-[clamp(0.86rem,0.82rem+0.2vw,0.98rem)] ${isDark ? "text-slate-200" : "text-slate-900"}`}>
            {total}
          </p>
        </div>
        <button
          className={`mt-3 w-full px-4 py-2 rounded-lg font-medium transition-all text-[clamp(0.78rem,0.74rem+0.22vw,0.9rem)] ${
            isDark
              ? "border border-slate-700 hover:bg-slate-700 text-slate-200"
              : "border border-slate-300 hover:bg-slate-100 text-slate-700"
          }`}
        >
          {action}
        </button>
      </article>
    );
  }

  return null;
};

export default Card;
