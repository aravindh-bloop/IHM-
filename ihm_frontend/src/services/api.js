/**
 * API configuration and service
 */

// In development with Vite proxy, use relative URLs
// The proxy will handle routing to the backend
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/api/health');
  }

  // Echo endpoint for testing
  async echo(message) {
    return this.request('/api/echo/', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request('/api/users');
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/cookie/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/api/auth/cookie/logout', {
      method: 'POST',
    });
  }
}

export default new ApiService();
