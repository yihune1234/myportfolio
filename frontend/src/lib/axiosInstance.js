/**
 * Single Axios instance used by all API service files.
 * Request interceptor attaches JWT from in-memory token store.
 * Response interceptor handles 401 by calling logout.
 */
import axios from 'axios';

// In-memory token store — read and written by AuthContext
// This is a plain JS variable, NOT localStorage or sessionStorage
let _token = null;
let _logoutHandler = null;

/**
 * Set the current JWT token (called by AuthContext on login/logout)
 * @param {string | null} token
 */
export function setAuthToken(token) {
  _token = token;
}

/**
 * Register a logout handler (called by AuthContext)
 * @param {Function} handler
 */
export function setLogoutHandler(handler) {
  _logoutHandler = handler;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT from in-memory store
axiosInstance.interceptors.request.use(
  (config) => {
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the token
      _token = null;
      // Call logout handler which redirects to /login
      if (typeof _logoutHandler === 'function') {
        _logoutHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;