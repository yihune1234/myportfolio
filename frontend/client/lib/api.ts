/**
 * API Configuration and Utilities
 * Centralized API endpoint management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Admin
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,
  ADMIN_PROFILE: `${API_URL}/api/admin/profile`,
  ADMIN_UPDATE_USERNAME: `${API_URL}/api/admin/username`,
  ADMIN_UPDATE_PASSWORD: `${API_URL}/api/admin/password`,

  // Projects
  PROJECTS_LIST: `${API_URL}/api/projects`,
  PROJECTS_GET: (id: string) => `${API_URL}/api/projects/${id}`,
  PROJECTS_CREATE: `${API_URL}/api/projects`,
  PROJECTS_UPDATE: (id: string) => `${API_URL}/api/projects/${id}`,
  PROJECTS_DELETE: (id: string) => `${API_URL}/api/projects/${id}`,

  // Messages
  MESSAGES_CREATE: `${API_URL}/api/messages`,
  MESSAGES_LIST: `${API_URL}/api/messages`,
  MESSAGES_GET: (id: string) => `${API_URL}/api/messages/${id}`,
  MESSAGES_MARK_READ: (id: string) => `${API_URL}/api/messages/${id}/read`,
  MESSAGES_DELETE: (id: string) => `${API_URL}/api/messages/${id}`,
};

/**
 * Get authorization header with JWT token
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch wrapper with error handling
 */
export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message, status: 500 };
  }
};

/**
 * Fetch with FormData (for file uploads)
 */
export const apiFetchFormData = async (
  url: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
) => {
  try {
    const response = await fetch(url, {
      method,
      headers: getAuthHeader(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message, status: 500 };
  }
};
