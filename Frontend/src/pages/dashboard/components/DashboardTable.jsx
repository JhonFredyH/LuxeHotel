
const DataTable = ({ data, isDark, statusClass, onRowClick }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className={`border-b ${isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Guest</th>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Room</th>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Date</th>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Status</th>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Total</th>
            <th className={`py-3.5 px-4 lg:px-6 text-left font-bold uppercase tracking-wider text-[clamp(0.68rem,0.65rem+0.15vw,0.76rem)] ${isDark ? "text-slate-300" : "text-slate-600"}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className={`border-b transition-colors ${
                isDark ? "border-slate-700 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              <td className="py-3.5 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                    {item.initials}
                  </div>
                  <span className="font-medium text-[clamp(0.8rem,0.75rem+0.25vw,0.93rem)]">{item.guest}</span>
                </div>
              </td>
              <td className={`py-3.5 px-4 lg:px-6 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.room}</td>
              <td className={`py-3.5 px-4 lg:px-6 text-[clamp(0.78rem,0.74rem+0.2vw,0.9rem)] ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.dates}</td>
              <td className="py-3.5 px-4 lg:px-6">
                <span className={`inline-flex items-center justify-center w-[7.5rem] px-3 py-1.5 rounded-lg font-semibold text-[clamp(0.67rem,0.63rem+0.16vw,0.78rem)] ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className={`py-3.5 px-4 lg:px-6 font-semibold text-[clamp(0.8rem,0.76rem+0.23vw,0.95rem)] ${isDark ? "text-slate-200" : "text-slate-900"}`}>{item.total}</td>
              <td className="py-3.5 px-4 lg:px-6">
                <button
                  onClick={() => onRowClick(item)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-[clamp(0.75rem,0.71rem+0.22vw,0.88rem)] ${
                    isDark
                      ? "border border-slate-700 hover:bg-slate-700 text-slate-300"
                      : "border border-slate-300 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

