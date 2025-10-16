/**
 * API configuration and service
 */

// Prefer relative URLs so proxies (Vite dev or Nginx) can keep same-origin.
// If VITE_API_URL is explicitly set, use it (e.g., external API host).
const API_BASE_URL = (import.meta.env?.VITE_API_URL ?? '');

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
      // Include cookies for cross-origin requests (required for cookie auth)
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (e.g., 204 from cookie login/logout)
      if (response.status === 204) {
        return null;
      }

      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        return await response.json();
      }

      // Fallback: return text (or null if empty)
      const text = await response.text();
      return text?.length ? text : null;
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
    // FastAPI Users cookie login expects x-www-form-urlencoded
    const form = new URLSearchParams();
    const username = credentials.username ?? credentials.email ?? '';
    form.set('username', username);
    form.set('password', credentials.password ?? '');
    // Optional fields supported by the endpoint
    form.set('scope', credentials.scope ?? '');
    if (credentials.grant_type) form.set('grant_type', credentials.grant_type);
    if (credentials.client_id) form.set('client_id', credentials.client_id);
    if (credentials.client_secret) form.set('client_secret', credentials.client_secret);

    return this.request('/api/auth/cookie/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
  }

  async logout() {
    return this.request('/api/auth/cookie/logout', {
      method: 'POST',
    });
  }
}

export default new ApiService();
