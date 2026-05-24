import axios from 'axios';

// Determine API base URL based on environment
// In development: use /api (Vite proxy handles forwarding to backend)
// In production: use actual backend URL from env variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if it's not from the initial auth check or logout
      const isAuthCheck = error.config?.url?.includes('/users/me');
      const isLogout = error.config?.url?.includes('/auth/cookie/logout');
      
      if (!isAuthCheck && !isLogout) {
        // Cookie expired or invalid during an API call
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== CHEF APIs ====================
export const chefAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/chef/orders', orderData);
    return response.data;
  },

  // Get all orders for the chef's kitchen
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/chef/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/chef/orders/${orderId}`);
    return response.data;
  },

  // Get order history with filters
  getOrderHistory: async (filters = {}) => {
    const response = await apiClient.get('/chef/orders/history', {
      params: filters,
    });
    return response.data;
  },

  // Get monthly expenses
  getMonthlyExpenses: async (month, year) => {
    const response = await apiClient.get('/chef/expenses/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  // Get expense summary
  getExpenseSummary: async (startDate, endDate) => {
    const response = await apiClient.get('/chef/expenses/summary', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Delete draft order (if needed)
  deleteOrder: async (orderId) => {
    const response = await apiClient.delete(`/chef/orders/${orderId}`);
    return response.data;
  },
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  // Inventory
  getInventory: async () => {
    const response = await apiClient.get('/admin/inventory');
    return response.data;
  },

  upsertInventory: async (data) => {
    const response = await apiClient.post('/admin/inventory', data);
    return response.data;
  },

  deleteInventory: async (itemId) => {
    const response = await apiClient.delete(`/admin/inventory/${itemId}`);
    return response.data;
  },

  // Orders
  getPendingOrders: async () => {
    const response = await apiClient.get('/admin/orders/pending');
    return response.data;
  },

  editRequest: async (requestId, data) => {
    const response = await apiClient.patch(`/admin/orders/request/${requestId}`, data);
    return response.data;
  },

  compileOrders: async (requiredDate = null) => {
    const body = requiredDate ? { required_date: requiredDate } : {};
    const response = await apiClient.post('/admin/orders/compile', body);
    return response.data;
  },

  getCompiledOrders: async () => {
    const response = await apiClient.get('/admin/orders/compiled');
    return response.data;
  },

  seedInventory: async () => {
    const response = await apiClient.post('/admin/inventory/seed');
    return response.data;
  },

  getItemCatalogue: async () => {
    const response = await apiClient.get('/admin/items/catalogue');
    return response.data;
  },

  getBills: async ({ view = 'daily', vendor_category, start_date, end_date } = {}) => {
    const params = { view };
    if (vendor_category) params.vendor_category = vendor_category;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    const response = await apiClient.get('/admin/bills', { params });
    return response.data;
  },

  // Legacy compat
  updateRequestStatus: async (requestId, statusData) => {
    const response = await apiClient.patch(`/admin/orders/request/${requestId}`, statusData);
    return response.data;
  },

  compileOrder: async (requiredDate = null) => {
    const body = requiredDate ? { required_date: requiredDate } : {};
    const response = await apiClient.post('/admin/orders/compile', body);
    return response.data;
  },
};

// ==================== VENDOR APIs ====================
export const vendorAPI = {
  // Get incoming orders (pending orders assigned to vendor)
  getIncomingOrders: async () => {
    const response = await apiClient.get('/vendor/orders/incoming');
    return response.data;
  },

  // Update order status with delivery quantities
  updateOrderStatus: async (orderId, updateData) => {
    const response = await apiClient.post(
      `/vendor/orders/${orderId}/update-status`,
      updateData
    );
    return response.data;
  },

  // Get supply history (completed/cancelled orders)
  getSupplyHistory: async () => {
    const response = await apiClient.get('/vendor/orders/history');
    return response.data;
  },
};

// ==================== STALL APIs ====================
export const stallAPI = {
  // Create new raw material request
  createRequest: async (requestData) => {
    const response = await apiClient.post('/stall/request', requestData);
    return response.data;
  },

  // Get all raw material requests for the stall
  getRequests: async () => {
    const response = await apiClient.get('/stall/request');
    return response.data;
  },

  // Update a specific request
  updateRequest: async (requestId, updateData) => {
    const response = await apiClient.patch(`/stall/request/${requestId}`, updateData);
    return response.data;
  },

  // Delete a specific request
  deleteRequest: async (requestId) => {
    const response = await apiClient.delete(`/stall/request/${requestId}`);
    return response.data;
  },

  // Get full item catalogue for ordering
  getAvailableItems: async () => {
    const response = await apiClient.get('/stall/items');
    return response.data;
  },
};

// ==================== HOD APIs ====================
export const hodAPI = {
  getPendingRequests: async () => {
    const response = await apiClient.get('/hod/orders/pending');
    return response.data;
  },

  editRequest: async (requestId, updateData) => {
    const response = await apiClient.patch(`/hod/orders/request/${requestId}`, updateData);
    return response.data;
  },

  deleteRequest: async (requestId) => {
    const response = await apiClient.delete(`/hod/orders/request/${requestId}`);
    return response.data;
  },

  addItem: async (data) => {
    const response = await apiClient.post('/hod/orders/request', data);
    return response.data;
  },

  submitToAdmin: async () => {
    const response = await apiClient.post('/hod/orders/submit');
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get('/hod/orders/history');
    return response.data;
  },

  getStalls: async () => {
    const response = await apiClient.get('/hod/stalls');
    return response.data;
  },
};

// ==================== COMMON APIs ====================
export const commonAPI = {
  // Get all kitchens
  getKitchens: async () => {
    const response = await apiClient.get('/common/kitchens');
    return response.data;
  },

  // Get order statuses
  getOrderStatuses: async () => {
    const response = await apiClient.get('/common/statuses');
    return response.data;
  },

  // Get items master list (if you have predefined items)
  getItems: async () => {
    const response = await apiClient.get('/common/items');
    return response.data;
  },
};

// ==================== AUTH APIs ====================
export const authAPI = {
  // Login with email and password
  login: async (credentials) => {
    // FastAPI Users expects URL-encoded form data for login
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    const response = await apiClient.post('/auth/cookie/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // Login returns 204 No Content on success
    return response.status === 204 || response.status === 200;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/cookie/logout');
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // Register new user (Admin only)
  registerUser: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get available kitchens
  getKitchens: async () => {
    const response = await apiClient.get('/kitchens');
    return response.data;
  },
};

export default apiClient;