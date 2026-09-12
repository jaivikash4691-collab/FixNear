import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixnear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    
    // Auto clear expired auth token
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Don't auto reload during active login attempt
      if (localStorage.getItem('fixnear_token')) {
        localStorage.removeItem('fixnear_token');
        localStorage.removeItem('fixnear_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
