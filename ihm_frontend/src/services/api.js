import axios from 'axios';

// Base API URL - uses environment variable in production, proxy in development
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

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
  // Get all pending raw material requests (merged)
  getPendingOrders: async () => {
    const response = await apiClient.get('/admin/orders/pending');
    return response.data;
  },

  // Compile and send orders to vendor
  compileOrder: async (orderData) => {
    const response = await apiClient.post('/admin/orders/compile', orderData);
    return response.data;
  },

  // Get all compiled orders
  getCompiledOrders: async () => {
    const response = await apiClient.get('/admin/orders/compiled');
    return response.data;
  },

  // Get specific compiled order by ID
  getCompiledOrderById: async (compiledOrderId) => {
    const response = await apiClient.get(`/admin/orders/compiled/${compiledOrderId}`);
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

  // Get available kitchens
  getKitchens: async () => {
    const response = await apiClient.get('/kitchens');
    return response.data;
  },
};

export default apiClient;