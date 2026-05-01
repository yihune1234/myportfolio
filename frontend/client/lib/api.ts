/**
 * API Configuration and Utilities
 * Centralized API endpoint management
 */

const API_URL = import.meta.env.VITE_API_URL

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

    // Check if the response is empty
    const contentType = response.headers.get('content-type');
    let data: any = null;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } else {
      // For non-JSON responses, just get the text or assume success if it's a 204
      const text = await response.text();
      data = { message: text || `API Error: ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Fetch Error:', message);
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

    const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } else {
      const text = await response.text();
      data = { message: text || `API Error: ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Fetch Form Data Error:', message);
    return { success: false, error: message, status: 500 };
  }
};
