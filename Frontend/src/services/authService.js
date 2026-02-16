import api from './api';

const authService = {
  // Login
  login: async (email, password) => {
    console.log('🔵 Intentando login con:', email); // ← AGREGAR
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      console.log('✅ Respuesta del servidor:', response.data); // ← AGREGAR
      const { access_token } = response.data;
      
      // Guardar token
      localStorage.setItem('token', access_token);
      
      // Decodificar el token para obtener info del usuario
      const userInfo = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return {
        success: true,
        user: userInfo,
        token: access_token,
      };
    } catch (error) {
      console.error('❌ Error en login:', error); // ← AGREGAR
      console.error('❌ Respuesta del error:', error.response); // ← AGREGAR
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al iniciar sesión',
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Verificar si el token expiró
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  },

  // Obtener perfil del usuario desde el backend
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener perfil',
      };
    }
  },
};

export default authService;