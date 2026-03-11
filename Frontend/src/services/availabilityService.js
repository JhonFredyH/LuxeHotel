import api from "./api";

export const fetchRoomAvailability = ({ roomId, checkIn, checkOut }) =>
  api.get(`/rooms/${roomId}/availability`, {
    params: { check_in: checkIn, check_out: checkOut },
  });
