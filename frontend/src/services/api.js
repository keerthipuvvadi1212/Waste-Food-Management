import axios from 'axios';

// Create configured axios instance pointing to the backend base API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to automatically attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zero_waste_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Network error / Server unreachable',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };

    // If unauthorized / token expired, clear token
    if (error.response?.status === 401) {
      // Don't auto-redirect if checking /auth/me
      if (!error.config.url.includes('/auth/me')) {
        localStorage.removeItem('zero_waste_token');
      }
    }

    return Promise.reject(customError);
  }
);

export default api;
