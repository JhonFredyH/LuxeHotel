import api from './api';

export const getRoomBySlug = async (slug) => {
  try {
    const response = await api.get('/rooms');
    const room = response.data.data.find(r => r.slug === slug);
    return room || null;
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
};