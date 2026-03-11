import { useAvailabilityCache } from "./useAvailabilityCache";
import { fetchRoomAvailability } from "../services/availabilityService";

const dateRangesOverlap = (startA, endA, startB, endB) =>
  new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);

export const computeAvailableUnits = (payload, checkInDate, checkOutDate) => {
  const hasUnits = Boolean(payload?.has_units);
  const units = Array.isArray(payload?.units) ? payload.units : [];
  const blocked = Array.isArray(payload?.blocked) ? payload.blocked : [];

  if (!hasUnits || units.length === 0) {
    return payload?.available ? 1 : 0;
  }

  const usableUnits = units.filter((unit) => unit.status !== "maintenance");
  const overlappingBlockedNumbers = new Set(
    blocked
      .filter((reservation) =>
        reservation?.room_number &&
        dateRangesOverlap(
          reservation.check_in,
          reservation.check_out,
          checkInDate,
          checkOutDate,
        ),
      )
      .map((reservation) => reservation.room_number),
  );

  const freeUnits = usableUnits.filter(
    (unit) => !overlappingBlockedNumbers.has(unit.unit_number),
  ).length;

  if (freeUnits === 0 && payload?.available) {
    return 1;
  }

  return Math.max(0, freeUnits);
};

export const useAvailability = () => {
  const { getAvailability, clearAvailabilityCache } = useAvailabilityCache();

  const getRoomAvailability = ({ roomId, checkIn, checkOut }) =>
    getAvailability({
      roomId,
      checkIn,
      checkOut,
      fetcher: () => fetchRoomAvailability({ roomId, checkIn, checkOut }),
    });

  return { getRoomAvailability, clearAvailabilityCache };
};
