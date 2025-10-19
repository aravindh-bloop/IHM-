import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chefAPI } from '../services/api';
import { 
  Plus, Trash2, Send, History, TrendingUp, 
  LogOut, Package, Calendar, DollarSign, Search 
} from 'lucide-react';

export default function ChefDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  
  // Create Order State
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [submitting, setSubmitting] = useState(false);
  
  // Order History State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Expense Tracker State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const units = ['kg', 'liters', 'pieces', 'grams', 'boxes', 'packets'];
  const statuses = ['all', 'pending', 'sent_to_admin', 'verified', 'confirmed', 'supplied'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load orders on mount
  useEffect(() => {
    if (activeTab === 'history') {
      fetchOrders();
    }
  }, [activeTab]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await chefAPI.getOrderHistory();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const data = await chefAPI.getMonthlyExpenses(selectedMonth, selectedYear);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  // Add item to order
  const addItem = () => {
    if (!itemName.trim() || !quantity || parseFloat(quantity) <= 0) {
      alert('Please enter valid item details');
      return;
    }

    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      quantity: parseFloat(quantity),
      unit: unit
    };

    setItems([...items, newItem]);
    setItemName('');
    setQuantity('');
    setUnit('kg');
  };

  // Remove item from order
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Submit order
  const submitOrder = async () => {
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        kitchen: user.kitchen,
        items: items.map(({ id, ...rest }) => rest),
        order_date: new Date().toISOString()
      };

      await chefAPI.createOrder(orderData);
      alert('Order submitted successfully!');
      setItems([]);
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items?.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      sent_to_admin: 'bg-blue-100 text-blue-800 border-blue-300',
      verified: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      supplied: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.kitchen} Kitchen</h1>
            <p className="text-sm text-gray-600">Chef: {user.name || user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'create', label: 'Create Order', icon: Plus },
              { id: 'history', label: 'Order History', icon: History },
              { id: 'expenses', label: 'Expense Tracker', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Create Order Tab */}
        {activeTab === 'create' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Item Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Add Items
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Rice, Tomatoes, Oil"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {units.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={addItem}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Order List */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Items ({items.length})
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items added yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={submitOrder}
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Order
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Order History
              </h2>
              <button
                onClick={fetchOrders}
                disabled={loadingOrders}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {loadingOrders ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Orders Table */}
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Total Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {new Date(order.created_at || order.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {order.items?.length || 0} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Expense Tracker Tab */}
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Monthly Expense Tracker
            </h2>

            {/* Month/Year Selector */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <button
                onClick={fetchExpenses}
                disabled={loadingExpenses}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loadingExpenses ? 'Loading...' : 'Get Expenses'}
              </button>
            </div>

            {/* Expense Display */}
            {expenses ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900">{expenses.total_orders || 0}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">Total Expense</p>
                  <p className="text-3xl font-bold text-green-900">₹{expenses.total_expense || 0}</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-1">Avg per Order</p>
                  <p className="text-3xl font-bold text-purple-900">
                    ₹{expenses.total_orders ? (expenses.total_expense / expenses.total_orders).toFixed(2) : 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select month and year to view expenses</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}