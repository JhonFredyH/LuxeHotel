import api from './api';
import { getRoomBySlug } from './roomService';

export const createGuestBooking = async (bookingData) => {
  try {
    // Si roomId es un slug, obtener el UUID real
    let roomUUID = bookingData.roomId;
    
    if (!isValidUUID(roomUUID)) {
      console.log('roomId no es UUID, buscando por slug:', roomUUID);
      const room = await getRoomBySlug(roomUUID);
      if (!room) {
        throw new Error('Room not found');
      }
      roomUUID = room.id;
    }

    const nameParts = bookingData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];

    const payload = {
      room_id: roomUUID, // ← Usar el UUID real
      check_in_date: bookingData.checkInDate,
      check_out_date: bookingData.checkOutDate,
      adults: bookingData.adults,
      children: bookingData.children || 0,
      special_requests: bookingData.specialRequests || null,
      first_name: firstName,
      last_name: lastName,
      email: bookingData.email,
      phone: bookingData.phone
    };

    console.log('Payload enviado al backend:', payload);

    const response = await api.post('/guest-booking', payload);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Response error:', error.response?.data);
    
    let errorMessage = 'Error creating reservation';
    
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail.map(e => e.msg || e.message || e).join(', ');
      } else {
        errorMessage = error.response.data.detail;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper para validar UUID
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}