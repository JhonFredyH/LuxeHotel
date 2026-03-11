import { useCallback, useRef } from "react";

const DEFAULT_TTL_MS = 60 * 1000; // 1 minute

export const useAvailabilityCache = (ttlMs = DEFAULT_TTL_MS) => {
  const cacheRef = useRef(new Map());
  const inflightRef = useRef(new Map());

  const getAvailability = useCallback(
    async ({ roomId, checkIn, checkOut, fetcher }) => {
      const key = `${roomId}|${checkIn}|${checkOut}`;
      const now = Date.now();
      const cached = cacheRef.current.get(key);

      if (cached && cached.expiresAt > now) {
        return cached.value;
      }

      const inflight = inflightRef.current.get(key);
      if (inflight) return inflight;

      const request = (async () => {
        try {
          const value = await fetcher();
          cacheRef.current.set(key, { value, expiresAt: now + ttlMs });
          return value;
        } finally {
          inflightRef.current.delete(key);
        }
      })();

      inflightRef.current.set(key, request);
      return request;
    },
    [ttlMs],
  );

  const clearAvailabilityCache = useCallback(() => {
    cacheRef.current.clear();
    inflightRef.current.clear();
  }, []);

  return { getAvailability, clearAvailabilityCache };
};
