const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Base API utility for making requests.
 */
export const api = {
  /**
   * GET request
   */
  get: async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * POST request
   */
  post: async (endpoint: string, data: any, options: RequestInit = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * PUT request
   */
  put: async (endpoint: string, data: any, options: RequestInit = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * DELETE request
   */
  delete: async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
