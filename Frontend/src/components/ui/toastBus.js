const listeners = new Set();

export const emitToast = (payload) => {
  listeners.forEach((listener) => listener(payload));
};

export const subscribeToToasts = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
