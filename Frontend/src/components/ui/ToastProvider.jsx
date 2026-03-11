import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { subscribeToToasts } from "./toastBus";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    card: "border-emerald-200 bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "text-emerald-900",
    message: "text-emerald-800",
  },
  error: {
    icon: AlertTriangle,
    card: "border-red-200 bg-red-50",
    iconColor: "text-red-600",
    title: "text-red-900",
    message: "text-red-800",
  },
  info: {
    icon: Info,
    card: "border-slate-200 bg-white",
    iconColor: "text-slate-600",
    title: "text-slate-900",
    message: "text-slate-700",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4500 }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const next = { id, type, title, message };
      setToasts((prev) => [...prev, next]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((payload) => {
      if (!payload) return;
      showToast(payload);
    });
    return () => unsubscribe();
  }, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[1000] w-full max-w-sm space-y-3">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl border p-4 shadow-lg ${style.card}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`} />
                <div className="min-w-0 flex-1">
                  {toast.title && (
                    <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
                  )}
                  {toast.message && (
                    <p className={`text-sm ${style.message}`}>{toast.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded p-1 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-700"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
