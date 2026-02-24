import api from './api';

const authService = {
  // ── Login admin ─────────────────────────────────────────────
  login: async (email, password) => {
    console.log('🔵 Intentando login con:', email);
    try {
      const response = await api.post('/login', { email, password });
      console.log('✅ Respuesta del servidor:', response.data);
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', 'admin');

      const userInfo = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(userInfo));

      return { success: true, user: userInfo, token: access_token };
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Respuesta del error:', error.response);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al iniciar sesión',
      };
    }
  },

  // ── Login guest ─────────────────────────────────────────────
  loginGuest: async (email, password) => {
    console.log('🔵 Intentando login guest con:', email);
    try {
      const response = await api.post('/guests/login', { email, password });
      console.log('✅ Respuesta guest:', response.data);
      const { access_token } = response.data;

      localStorage.setItem('guest_token', access_token);
      localStorage.setItem('user_role', 'guest');

      const guestInfo = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(guestInfo));

      return { success: true, user: guestInfo, token: access_token };
    } catch (error) {
      console.error('❌ Error en login guest:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al iniciar sesión',
      };
    }
  },

  // ── Logout ──────────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guest_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user');
  },

  // ── Usuario actual ───────────────────────────────────────────
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // ── Rol ─────────────────────────────────────────────────────
  getRole: () => localStorage.getItem('user_role'),
  isAdmin: () => localStorage.getItem('user_role') === 'admin',
  isGuest: () => localStorage.getItem('user_role') === 'guest',

  // ── Token activo según rol ───────────────────────────────────
  getToken: () => {
    const role = localStorage.getItem('user_role');
    return role === 'guest'
      ? localStorage.getItem('guest_token')
      : localStorage.getItem('token');
  },

  // ── Verifica si está autenticado (admin o guest) ─────────────
  isAuthenticated: () => {
    const role = localStorage.getItem('user_role');
    const token = role === 'guest'
      ? localStorage.getItem('guest_token')
      : localStorage.getItem('token');

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  // ── Perfil desde el backend ──────────────────────────────────
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener perfil',
      };
    }
  },
};

export default authService;