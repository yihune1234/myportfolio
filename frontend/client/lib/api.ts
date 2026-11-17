/**
 * API Configuration and Utilities
 * Centralized API endpoint management
 */

const API_URL = import.meta.env.VITE_API_URL || "";

export const API_ENDPOINTS = {
  // Admin
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,
  ADMIN_PROFILE: `${API_URL}/api/admin/profile`,
  ADMIN_UPDATE_USERNAME: `${API_URL}/api/admin/username`,
  ADMIN_UPDATE_PASSWORD: `${API_URL}/api/admin/password`,
  ADMIN_GITHUB_SETTINGS: `${API_URL}/api/admin/github-settings`,
  ADMIN_GITHUB_VALIDATE: `${API_URL}/api/admin/github-validate`,
  ADMIN_GITHUB_SYNC: `${API_URL}/api/admin/github-sync`,
  ADMIN_THEME: `${API_URL}/api/admin/theme`,
  THEME: `${API_URL}/api/theme`,

  // Projects
  PROJECTS_LIST: `${API_URL}/api/projects`,
  PROJECTS_ADMIN_ALL: `${API_URL}/api/projects/admin/all`,
  PROJECTS_GET: (id: string) => `${API_URL}/api/projects/${id}`,
  PROJECTS_CREATE: `${API_URL}/api/projects`,
  PROJECTS_UPDATE: (id: string) => `${API_URL}/api/projects/${id}`,
  PROJECTS_DELETE: (id: string) => `${API_URL}/api/projects/${id}`,
  PROJECTS_PIN_TOGGLE: (id: string) => `${API_URL}/api/projects/${id}/pin`,
  PROJECTS_PUBLISH_TOGGLE: (id: string) => `${API_URL}/api/projects/${id}/publish`,
  PROJECTS_SYNC: (id: string) => `${API_URL}/api/projects/${id}/sync`,
  PROJECTS_IMPORT_GITHUB: `${API_URL}/api/projects/import-github`,

  // GitHub Telemetry & Browsing
  GITHUB_REPO_DETAILS: (owner: string, repo: string, refresh = false) =>
    `${API_URL}/api/github/repo-details?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}${refresh ? '&refresh=true' : ''}`,
  GITHUB_PERSONAL_REPOS: (params: string = '') =>
    `${API_URL}/api/github/personal/repos${params ? `?${params}` : ''}`,
  GITHUB_ORG_REPOS: (params: string = '') =>
    `${API_URL}/api/github/organization/repos${params ? `?${params}` : ''}`,

  // Project Images
  PROJECT_IMAGES_LIST: (id: string) => `${API_URL}/api/projects/${id}/images`,
  PROJECT_IMAGES_UPLOAD: (id: string) => `${API_URL}/api/projects/${id}/images`,
  PROJECT_IMAGE_DELETE: (id: string, imageId: string) => `${API_URL}/api/projects/${id}/images/${imageId}`,
  PROJECT_IMAGE_UPDATE: (id: string, imageId: string) => `${API_URL}/api/projects/${id}/images/${imageId}`,
  PROJECT_IMAGES_REORDER: (id: string) => `${API_URL}/api/projects/${id}/images/reorder`,

  // Messages
  MESSAGES_CREATE: `${API_URL}/api/messages`,
  MESSAGES_LIST: `${API_URL}/api/messages`,
  MESSAGES_GET: (id: string) => `${API_URL}/api/messages/${id}`,
  MESSAGES_MARK_READ: (id: string) => `${API_URL}/api/messages/${id}/read`,
  MESSAGES_DELETE: (id: string) => `${API_URL}/api/messages/${id}`,
  MESSAGES_REPLY: (id: string) => `${API_URL}/api/messages/${id}/reply`,

  // AI Assistant
  AI_CHAT: `${API_URL}/api/ai/chat`,
};

/**
 * Get authorization header with JWT token
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch wrapper with error handling
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
    });

    // Check content type
    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } else if (response.status === 204) {
      data = null;
    } else {
      const text = await response.text();
      throw new Error(`Expected JSON response, got ${contentType || "unknown"}: ${text.slice(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(data?.message || `API Error: ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Fetch Error:", message);
    return { success: false, error: message, status: 500 };
  }
};

/**
 * Fetch with FormData (for file uploads)
 */
export const apiFetchFormData = async (
  url: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
) => {
  try {
    const response = await fetch(url, {
      method,
      headers: getAuthHeader(),
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
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
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Fetch Form Data Error:", message);
    return { success: false, error: message, status: 500 };
  }
};
