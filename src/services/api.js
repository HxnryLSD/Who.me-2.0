import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username, email, password, displayName) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      displayName
    });
    return response.data;
  },

  login: async (usernameOrEmail, password) => {
    const response = await api.post('/auth/login', {
      usernameOrEmail,
      password
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get('/dashboards/me');
    return response.data.dashboard;
  },

  saveDashboard: async (tabs, settings) => {
    const response = await api.post('/dashboards', { tabs, settings });
    return response.data.dashboard;
  },

  updateDashboard: async (dashboardData) => {
    const response = await api.put('/dashboards', dashboardData);
    return response.data.dashboard;
  },

  getPublicDashboard: async (username) => {
    const response = await api.get(`/dashboards/public/${username}`);
    return response.data.dashboard;
  }
};

// User API
export const userAPI = {
  getPublicUsers: async () => {
    const response = await api.get('/users/public');
    return response.data;
  }
};

export default api;
