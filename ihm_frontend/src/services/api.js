import axios from 'axios';

// Base API URL - uses proxy in development
const API_BASE_URL = '/api';

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
  // Get all pending merged orders
  getPendingOrders: async () => {
    const response = await apiClient.get('/admin/orders/pending');
    return response.data;
  },

  // Get merged order details
  getMergedOrderById: async (orderId) => {
    const response = await apiClient.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Verify and forward order to vendor
  verifyOrder: async (orderId) => {
    const response = await apiClient.post(`/admin/orders/${orderId}/verify`);
    return response.data;
  },

  // Get all verified orders
  getVerifiedOrders: async (params = {}) => {
    const response = await apiClient.get('/admin/orders/verified', { params });
    return response.data;
  },

  // Get order history
  getOrderHistory: async (filters = {}) => {
    const response = await apiClient.get('/admin/orders/history', {
      params: filters,
    });
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get('/admin/statistics');
    return response.data;
  },
};

// ==================== VENDOR APIs ====================
export const vendorAPI = {
  // Get all orders from admin
  getOrders: async (status = 'verified') => {
    const response = await apiClient.get('/vendor/orders', {
      params: { status },
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/vendor/orders/${orderId}`);
    return response.data;
  },

  // Confirm order
  confirmOrder: async (orderId) => {
    const response = await apiClient.post(`/vendor/orders/${orderId}/confirm`);
    return response.data;
  },

  // Mark order as supplied
  markAsSupplied: async (orderId, supplyData = {}) => {
    const response = await apiClient.post(
      `/vendor/orders/${orderId}/supply`,
      supplyData
    );
    return response.data;
  },

  // Get supply history
  getSupplyHistory: async (filters = {}) => {
    const response = await apiClient.get('/vendor/orders/history', {
      params: filters,
    });
    return response.data;
  },

  // Get pending supplies
  getPendingSupplies: async () => {
    const response = await apiClient.get('/vendor/orders/pending-supplies');
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
    // FastAPI Users expects form data for login
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post('/auth/cookie/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
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
};

export default apiClient;