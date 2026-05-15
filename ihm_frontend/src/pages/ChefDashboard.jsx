import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { stallAPI } from '../services/api';
import { Plus, Trash2, History, LogOut, ChefHat, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const AVAILABLE_ITEMS = [
  "Onion", "Tomato", "Potato", "Carrot", "Garlic", "Ginger", "Green Chilli", "Bell Pepper (Capsicum)", "Cabbage", "Cauliflower", "Spinach", "Lady's Finger (Okra)", "Brinjal (Eggplant)", "Cucumber", "Lemon", "Coriander Leaves", "Mint Leaves", "Curry Leaves",
  "Basmati Rice", "Sona Masoori Rice", "Idli Rice", "Whole Wheat Flour (Atta)", "All-Purpose Flour (Maida)", "Semolina (Rava/Sooji)", "Toor Dal (Arhar)", "Moong Dal", "Chana Dal", "Urad Dal", "Masoor Dal", "Chickpeas (Kabuli Chana)",
  "Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Powder", "Garam Masala", "Mustard Seeds", "Cumin Seeds", "Fenugreek Seeds", "Asafoetida (Hing)", "Black Pepper", "Cardamom", "Cloves", "Cinnamon", "Salt",
  "Milk", "Yogurt (Curd)", "Paneer", "Ghee", "Butter",
  "Sunflower Oil", "Groundnut Oil", "Mustard Oil", "Coconut Oil",
  "Sugar", "Jaggery", "Poha (Flattened Rice)", "Tamarind", "Vinegar"
];

const DashboardStyles = () => (
  <style>{`
    .dashboard-container {
      display: flex;
      height: 100vh;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: var(--bg-primary);
      border-right: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-md);
    }

    .sidebar-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%);
    }

    .sidebar-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary-700);
      letter-spacing: -0.01em;
      margin-bottom: var(--spacing-sm);
    }

    .sidebar-subtitle {
      font-size: var(--text-xs);
      color: var(--text-muted);
      font-weight: 500;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      color: var(--text-secondary);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
      background: none;
      text-align: left;
      font-family: var(--font-body);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .sidebar-link:hover {
      background: var(--bg-secondary);
      color: var(--primary-600);
    }

    .sidebar-link.active {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: var(--text-inverse);
      box-shadow: var(--shadow-md);
    }

    .sidebar-link svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      min-width: 0;
    }

    .header {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-default);
      padding: var(--spacing-lg) var(--spacing-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }

    .header-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
    }

    .header-subtitle {
      font-size: var(--text-sm);
      color: var(--text-muted);
      margin-top: var(--spacing-xs);
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--danger-500);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: var(--text-sm);
      transition: all var(--transition-fast);
    }

    .btn-logout:hover {
      background: var(--danger-600);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .btn-theme-toggle:hover {
      background: var(--bg-tertiary);
      color: var(--primary-600);
    }

    /* Page Content */
    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-2xl);
      min-height: 0;
    }

    .page-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }

    .page-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .page-description {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    /* Cards */
    .card {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-lg);
    }

    /* Catalog Layout */
    .catalog-layout {
      display: flex;
      gap: var(--spacing-2xl);
      height: 100%;
      align-items: flex-start;
    }
    
    .catalog-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }
    
    .item-card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-default);
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
    }
    
    .item-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    
    .item-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-bottom: 1px solid var(--border-light);
    }
    
    .item-content {
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      flex: 1;
    }
    
    .item-title {
      font-weight: 600;
      font-size: var(--text-base);
      color: var(--text-primary);
      margin: 0;
    }
    
    .item-controls {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .qty-input {
      width: 60px;
      text-align: center;
      padding: 0.5rem;
    }
    
    .cart-sidebar {
      width: 350px;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      position: sticky;
      top: 0;
      max-height: calc(100vh - 120px);
    }
    
    .cart-items-container {
      flex: 1;
      overflow-y: auto;
      padding-right: var(--spacing-sm);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
    }
    
    .cart-item-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    @media (max-width: 1024px) {
      .catalog-layout {
        flex-direction: column;
      }
      .cart-sidebar {
        width: 100%;
        position: static;
        max-height: none;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        min-height: auto;
        flex-direction: column;
        border-right: none;
        border-bottom: 1px solid var(--border-default);
      }

      .sidebar-header {
        padding: var(--spacing-md) var(--spacing-lg);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sidebar-title {
        font-size: 1.25rem;
        margin: 0;
      }

      .sidebar-nav {
        flex-direction: row;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .sidebar-nav::-webkit-scrollbar {
        display: none;
      }

      .sidebar-link {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--text-xs);
        white-space: nowrap;
      }

      .main-content {
        flex: 1;
      }

      .header {
        padding: var(--spacing-md) var(--spacing-lg);
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md);
      }

      .header-title {
        font-size: var(--text-base);
      }

      .page-content {
        padding: var(--spacing-lg);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .card {
        padding: var(--spacing-md);
      }

      .table-container {
        font-size: 0.875rem;
      }

      table {
        font-size: var(--text-xs);
      }

      th, td {
        padding: 0.5rem;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .form-label {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-input, .form-select {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: var(--text-base);
      transition: all var(--transition-fast);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    /* Button */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: var(--text-sm);
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-md);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: var(--border-default);
    }

    .btn-danger {
      background: var(--danger-600);
    }

    .btn-danger:hover {
      background: var(--danger-700);
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      background: var(--bg-secondary);
      padding: var(--spacing-md);
      text-align: left;
      font-weight: 600;
      font-size: var(--text-xs);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--border-default);
    }

    .table td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-light);
      color: var(--text-primary);
    }

    .table tbody tr:hover {
      background: var(--bg-secondary);
    }

    .table-empty {
      text-align: center;
      padding: var(--spacing-3xl) var(--spacing-md);
      color: var(--text-muted);
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pending {
      background: var(--warning-50);
      color: var(--warning-700);
    }

    .status-approved {
      background: var(--success-50);
      color: var(--success-700);
    }

    .status-completed {
      background: var(--success-50);
      color: var(--success-700);
    }

    .status-rejected {
      background: var(--danger-50);
      color: var(--danger-700);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      max-width: 500px;
      width: 95%;
      box-shadow: var(--shadow-2xl);
    }

    .modal-title {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-lg);
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: flex-end;
      margin-top: var(--spacing-2xl);
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-top: none;
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      max-height: 240px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: var(--shadow-lg);
    }

    .search-result-item {
      padding: var(--spacing-md);
      cursor: pointer;
      transition: background var(--transition-fast);
      border-bottom: 1px solid var(--border-light);
    }

    .search-result-item:hover {
      background: var(--bg-secondary);
      color: var(--primary-600);
    }
  `}</style>
);

// Sidebar Component
const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">FUMU</div>
        <div className="sidebar-subtitle">Chef Portal</div>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activePage === 'create-order' ? 'active' : ''}`}
          onClick={() => setActivePage('create-order')}
        >
          <Plus size={20} />
          Create Order
        </button>
        <button
          className={`sidebar-link ${activePage === 'order-history' ? 'active' : ''}`}
          onClick={() => setActivePage('order-history')}
        >
          <History size={20} />
          Order History
        </button>
      </nav>
    </aside>
  );
};

// Header Component
const Header = ({ kitchen, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <div>
        <div className="header-title">Welcome, Chef</div>
        <div className="header-subtitle">Kitchen: <strong>{kitchen || 'Loading...'}</strong></div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
        <button 
          className="btn-theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="btn-logout" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

// Create Order Page
const CreateOrderPage = () => {
  const [orderItems, setOrderItems] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [catalogStates, setCatalogStates] = React.useState({});

  const filteredItems = AVAILABLE_ITEMS.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateState = (item, field, value) => {
    setCatalogStates(prev => ({
      ...prev,
      [item]: {
        ...(prev[item] || { quantity: 1, unit: 'kg' }),
        [field]: value
      }
    }));
  };

  const handleAddItem = (item) => {
    const state = catalogStates[item] || { quantity: 1, unit: 'kg' };
    const quantity = parseInt(state.quantity) || 1;
    
    const existingIndex = orderItems.findIndex(i => i.name === item && i.unit === state.unit);
    
    if (existingIndex >= 0) {
      const newItems = [...orderItems];
      newItems[existingIndex].quantity += quantity;
      setOrderItems(newItems);
    } else {
      setOrderItems([...orderItems, { name: item, quantity, unit: state.unit }]);
    }
    
    toast.success(`Added ${quantity} ${state.unit} of ${item} to cart`);
    
    setCatalogStates(prev => ({
      ...prev,
      [item]: { quantity: 1, unit: state.unit }
    }));
  };

  const handleRemoveItem = (indexToRemove) => {
    setOrderItems(orderItems.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('Please add items to your order before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const requestData = {
        items: orderItems.map(item => ({
          item_name: item.name,
          quantity: parseInt(item.quantity),
          unit: item.unit
        }))
      };

      await stallAPI.createRequest(requestData);

      toast.success(`Success! ${orderItems.length} items submitted to Admin. Clearing cart...`);

      setTimeout(() => {
        setOrderItems([]);
      }, 2000);

    } catch (error) {
      console.error("Error submitting order:", error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderImg = "https://cdn.britannica.com/17/196817-159-9E487F15/vegetables.jpg";

  return (
    <div className="page-section" style={{ height: '100%' }}>
      <div className="catalog-layout">
        
        {/* Main Catalog Area */}
        <div className="catalog-main">
          <div>
            <h1 className="page-title">Create Daily Order</h1>
            <p className="page-description">Browse and add items to your cart, then submit to Admin.</p>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="form-group" style={{ maxWidth: '400px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search catalogue (e.g., Onion, Tomato...)"
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          
          <div className="catalog-grid">
            {filteredItems.map(item => {
              const state = catalogStates[item] || { quantity: 1, unit: 'kg' };
              return (
                <div key={item} className="item-card">
                  <img src={placeholderImg} alt={item} className="item-image" />
                  <div className="item-content">
                    <h3 className="item-title">{item}</h3>
                    
                    <div className="item-controls">
                      <input 
                        type="number" 
                        min="1"
                        className="form-input qty-input" 
                        value={state.quantity}
                        onChange={(e) => handleUpdateState(item, 'quantity', e.target.value)}
                      />
                      <select 
                        className="form-select"
                        value={state.unit}
                        onChange={(e) => handleUpdateState(item, 'unit', e.target.value)}
                        style={{ flex: 1, padding: '0.5rem' }}
                      >
                        <option>kg</option>
                        <option>liters</option>
                        <option>pieces</option>
                        <option>grams</option>
                        <option>packet</option>
                      </select>
                    </div>
                    
                    <button 
                      className="btn" 
                      style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                      onClick={() => handleAddItem(item)}
                    >
                      <Plus size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                No items found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
        
        {/* Cart Sidebar */}
        <div className="cart-sidebar">
          <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-light)' }}>
            Your Cart ({orderItems.length})
          </h2>
          
          <div className="cart-items-container">
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{item.name}</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', minHeight: 'auto' }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--spacing-xl) 0', fontSize: 'var(--text-sm)' }}>
                Your cart is empty. Add items from the catalogue.
              </div>
            )}
          </div>
          
          <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
            <button
              className="btn"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || orderItems.length === 0}
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%)' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Final Order'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

// Order History Page
const OrderHistoryPage = () => {
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [dateFilter, setDateFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  React.useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading order history...');
      const response = await stallAPI.getRequests();
      console.log('Order history response:', response);
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Error loading order history:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Error detail:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const sortedRequests = [...requests].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  const filteredRequests = sortedRequests.filter(request => {
    const matchesDate = !dateFilter ||
      new Date(request.created_at).toISOString().split('T')[0] === dateFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Order History</h1>
        <p className="page-description">View all your submitted raw material requests.</p>
      </div>

      <div className="card">
        {error && (
          <div style={{
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--danger-50)',
            border: '1px solid var(--danger-200)',
            color: 'var(--danger-700)',
            fontSize: 'var(--text-sm)'
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={loadOrderHistory}
              style={{
                marginLeft: 'var(--spacing-md)',
                background: 'var(--danger-600)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}
            >
              Retry
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="status-filter" className="form-label">Status</label>
            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="date-filter" className="form-label">Date</label>
            <input
              type="date"
              id="date-filter"
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="btn btn-secondary"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Date Requested</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-empty">Loading history...</td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td><strong>{request.item_name}</strong></td>
                    <td>{request.quantity}</td>
                    <td>{request.unit}</td>
                    <td>
                      <span className={`status-badge status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>
                      {formatTimestamp(request.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="table-empty">
                    {dateFilter || statusFilter !== 'all'
                      ? 'No requests found matching your filters.'
                      : 'No past requests found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main ChefDashboard Component
export default function ChefDashboard() {
  const [activePage, setActivePage] = React.useState('create-order');
  const { user, logout } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'create-order':
        return <CreateOrderPage />;
      case 'order-history':
        return <OrderHistoryPage />;
      default:
        return <CreateOrderPage />;
    }
  };

  return (
    <>
      <DashboardStyles />
      <div className="dashboard-container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          <Header kitchen={user?.kitchen} onLogout={logout} />
          <div className="page-content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
