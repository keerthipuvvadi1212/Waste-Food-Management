import axios from 'axios';

// Resolve API base URL with production Render fallback and localhost dev fallback
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // If running in production (e.g. deployed on Vercel), point to Render backend
  if (import.meta.env.PROD || (typeof window !== 'undefined' && !window.location.hostname.includes('localhost'))) {
    return 'https://waste-food-management-wcm2.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

// Create configured axios instance pointing to backend
const api = axios.create({
  baseURL: getBaseUrl(),
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
