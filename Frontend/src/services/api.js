import axios from 'axios';
import { emitToast } from '../components/ui/toastBus';

// URL base de tu backend
const API_URL = 'http://localhost:8000';

// Crear instancia de axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem('user_role');
    const token =
      role === 'guest'
        ? localStorage.getItem('guest_token')
        : localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Request failed';

    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      emitToast({
        type: 'error',
        title: 'Session expired',
        message: 'Please log in again.',
      });
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!error.response) {
      emitToast({
        type: 'error',
        title: 'Network error',
        message: 'Could not reach the server. Check your connection.',
      });
    } else if (status >= 400 && status < 500) {
      let detail = error.response?.data?.detail || error.response?.data?.message || message;
      if (Array.isArray(detail)) {
        detail = detail
          .map((item) => item?.msg || item?.message || item?.detail || String(item))
          .join(', ');
      }
      emitToast({
        type: 'error',
        title: 'Request error',
        message: String(detail || message),
      });
    } else if (status >= 500) {
      emitToast({
        type: 'error',
        title: 'Server error',
        message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
