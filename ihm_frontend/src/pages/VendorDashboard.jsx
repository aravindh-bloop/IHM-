import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { vendorAPI } from '../services/api';
import { Send, History, LogOut, Package, Eye, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardStyles = () => (
  <style>{`
    .dashboard-container {
      display: flex;
      height: 100vh;
      background: linear-gradient(-45deg, var(--bg-primary), var(--primary-100), var(--accent-100), var(--bg-secondary));
      background-size: 400% 400%;
      animation: gradientMove 15s ease infinite;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-md);
      z-index: 10;
    }

    .sidebar-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--glass-border);
      background: transparent;
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
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      min-width: 0;
    }

    .header {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-bottom: 1px solid var(--glass-border);
      padding: var(--spacing-lg) var(--spacing-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      z-index: 5;
    }

    .header-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
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
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
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
    }

    .page-description {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--glass-shadow);
      border: 1px solid var(--glass-border);
      animation: fadeIn 0.4s ease-out forwards;
      transition: all var(--transition-base);
    }
    
    .card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-4px);
    }

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
      border-bottom: 2px solid var(--border-default);
    }

    .table td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-light);
    }

    .table tbody tr:hover {
      background: var(--bg-secondary);
    }

    .table tbody tr {
      animation: fadeIn 0.3s ease-out forwards;
    }

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

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: var(--text-xs);
    }

    .btn-success {
      background: linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%);
    }

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

    .status-completed,
    .status-delivered {
      background: var(--success-50);
      color: var(--success-700);
    }

    .status-cancelled {
      background: var(--danger-50);
      color: var(--danger-700);
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

    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: var(--text-base);
      transition: all var(--transition-fast);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-md);
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .item-quantity {
      font-size: var(--text-sm);
      color: var(--text-muted);
      margin-top: var(--spacing-xs);
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
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

      .order-card {
        padding: var(--spacing-md);
      }

      .table-container {
        font-size: 0.875rem;
        overflow-x: auto;
      }

      table {
        font-size: var(--text-xs);
      }

      th, td {
        padding: 0.5rem;
      }

      .input-group {
        flex-direction: column;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
);

const CATEGORY_LABELS = {
  seafood: 'Seafood',
  vegetables_fruits: 'Vegetables & Fruits',
  general_provisions: 'General Provisions',
};

const Sidebar = ({ activePage, setActivePage }) => {
  const { user } = useAuth();
  const catLabel = CATEGORY_LABELS[user?.vendor_category] || 'Vendor';
  const links = [
    { id: 'incoming', label: 'Incoming Orders', icon: Package },
    { id: 'history', label: 'Supply History', icon: History }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">FUMU</div>
        <div className="sidebar-subtitle">{catLabel}</div>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-link ${activePage === id ? 'active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const catLabel = CATEGORY_LABELS[user?.vendor_category] || 'Vendor';

  return (
    <header className="header">
      <h2 className="header-title">Welcome, {catLabel}</h2>
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

const IncomingOrdersPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [feedback, setFeedback] = React.useState({});

  React.useEffect(() => {
    fetchIncomingOrders();
  }, []);

  const fetchIncomingOrders = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getIncomingOrders();
      setOrders(response);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch incoming orders';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (orderId, itemId, key, value) => {
    setFeedback(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemId]: {
          ...(prev[orderId]?.[itemId] ?? {}),
          [key]: value
        }
      }
    }));
  };

  const computeOrderTotal = (order) => {
    return order.items.reduce((sum, item) => {
      const qty = feedback[order.order_id]?.[item.item_id]?.deliveredQty ?? item.total_quantity;
      const price = feedback[order.order_id]?.[item.item_id]?.unitPrice;
      if (price == null) return sum;
      return sum + (qty * price);
    }, 0);
  };

  const handleGenerateBill = async (orderId) => {
    const order = orders.find(o => o.order_id === orderId);

    // Validate: every item must have a unit price set
    const missingPrice = order.items.find(it => {
      const price = feedback[orderId]?.[it.item_id]?.unitPrice;
      return price == null || isNaN(price);
    });
    if (missingPrice) {
      toast.error(`Set a unit price for "${missingPrice.item_name}" before generating the bill.`);
      return;
    }

    const total = computeOrderTotal(order);
    const ok = window.confirm(
      `Generate bill of ₹${total.toFixed(2)} for this order? This action is final and cannot be undone.`
    );
    if (!ok) return;

    try {
      const items = order.items.map(item => ({
        item_id: item.item_id,
        delivered_quantity: feedback[orderId]?.[item.item_id]?.deliveredQty ?? item.total_quantity,
        unit_price: feedback[orderId]?.[item.item_id]?.unitPrice
      }));

      const res = await vendorAPI.updateOrderStatus(orderId, {
        items: items,
        mark_as_completed: true,
      });

      toast.success(`Bill ${res.invoice_number} generated — ₹${(res.total_price || total).toFixed(2)}`);
      fetchIncomingOrders();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to generate bill';
      toast.error(errorMsg);
    }
  };

  const handleSaveDraft = async (orderId) => {
    const order = orders.find(o => o.order_id === orderId);
    try {
      const items = order.items.map(item => ({
        item_id: item.item_id,
        delivered_quantity: feedback[orderId]?.[item.item_id]?.deliveredQty ?? item.total_quantity,
        unit_price: feedback[orderId]?.[item.item_id]?.unitPrice ?? null
      }));
      await vendorAPI.updateOrderStatus(orderId, { items, mark_as_completed: false });
      toast.success('Draft saved');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to save draft';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Incoming Orders</h1>
        <p className="page-description">Manage delivery quantities and pricing for incoming orders.</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading incoming orders...
          </div>
        ) : orders.length > 0 ? (
          <div className="page-section">
            {orders.map((order) => (
              <div key={order.order_id} style={{ paddingBottom: 'var(--spacing-2xl)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
                        Order #{order.order_id.substring(0, 8).toUpperCase()}
                        {order.required_date && (
                          <span style={{
                            marginLeft: 12, padding: '4px 10px',
                            background: 'var(--primary-100)', color: 'var(--primary-700)',
                            borderRadius: 999, fontSize: 'var(--text-xs)', fontWeight: 700
                          }}>
                            Deliver by {new Date(order.required_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </h3>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                        Created {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.items.map((item) => (
                    <div key={item.item_id} className="item-row">
                      <div className="item-info">
                        <div className="item-name">{item.item_name}</div>
                        <div className="item-quantity">
                          Requested: {item.total_quantity} {item.unit}
                        </div>
                      </div>
                      <div className="input-group">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: 'var(--text-xs)' }}>Delivered</label>
                          <input
                            type="number"
                            min="0"
                            max={item.total_quantity}
                            className="form-input"
                            placeholder="Qty"
                            value={feedback[order.order_id]?.[item.item_id]?.deliveredQty ?? item.total_quantity}
                            onChange={(e) => handleFeedbackChange(order.order_id, item.item_id, 'deliveredQty', parseInt(e.target.value) || 0)}
                            style={{ width: '100px' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: 'var(--text-xs)' }}>Unit Price</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            placeholder="₹"
                            value={feedback[order.order_id]?.[item.item_id]?.unitPrice ?? ''}
                            onChange={(e) => handleFeedbackChange(order.order_id, item.item_id, 'unitPrice', parseFloat(e.target.value) || null)}
                            style={{ width: '100px' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 'var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                  }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      Running total:{' '}
                      <strong style={{ color: 'var(--success-700)', fontSize: 'var(--text-base)' }}>
                        ₹{computeOrderTotal(order).toFixed(2)}
                      </strong>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="btn btn-small"
                        onClick={() => handleSaveDraft(order.order_id)}
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                      >
                        Save Draft
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleGenerateBill(order.order_id)}
                      >
                        <Send size={18} />
                        Generate Bill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No incoming orders at this time.
          </div>
        )}
      </div>
    </div>
  );
};

const SupplyHistoryPage = () => {
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [expandedOrder, setExpandedOrder] = React.useState(null);

  React.useEffect(() => {
    fetchSupplyHistory();
  }, []);

  const fetchSupplyHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorAPI.getSupplyHistory();
      setHistory(Array.isArray(response) ? response : []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch history';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Supply History</h1>
        <p className="page-description">View all completed and cancelled orders.</p>
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
              onClick={fetchSupplyHistory}
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
        {loading ? (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading supply history...
          </div>
        ) : history.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Delivered</th>
                  <th>Delivery Date</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((order) => (
                   <>
                   <tr key={order.order_id}>
                    <td>
                      <strong style={{ color: 'var(--primary-700)', fontFamily: 'var(--font-mono, monospace)' }}>
                        {order.invoice_number || '—'}
                      </strong>
                    </td>
                    <td>
                      {order.delivered_at
                        ? new Date(order.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : new Date(order.date).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                      {order.required_date
                        ? new Date(order.required_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                    <td>{order.total_items}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: order.total_price ? 'var(--success-700)' : 'var(--text-muted)' }}>
                      {order.total_price ? `₹${order.total_price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="btn btn-small"
                        onClick={() => setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id)}
                        style={{ padding: '0.3rem 0.75rem' }}
                      >
                        <Eye size={16} />
                        {expandedOrder === order.order_id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.order_id && (
                    <tr key={`${order.order_id}-detail`}>
                      <td colSpan={7} style={{ padding: '0 var(--spacing-md) var(--spacing-md)', background: 'var(--bg-secondary)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>Item</th>
                              <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>Ordered</th>
                              <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>Delivered</th>
                              <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>Unit Price</th>
                              <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '0.4rem 0.5rem' }}>{item.item_name}</td>
                                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{item.total_quantity} {item.unit}</td>
                                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{item.delivered_quantity ?? '—'} {item.unit}</td>
                                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{item.unit_price != null ? `₹${item.unit_price.toFixed(2)}` : '—'}</td>
                                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>{item.total_price != null ? `₹${item.total_price.toFixed(2)}` : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                   )}
                   </>
                 ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p><strong>No supply history found.</strong></p>
            <p style={{ fontSize: 'var(--text-sm)' }}>Your completed or cancelled orders will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function VendorDashboard() {
  const [activePage, setActivePage] = React.useState('incoming');
  const { logout } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'incoming':
        return <IncomingOrdersPage />;
      case 'history':
        return <SupplyHistoryPage />;
      default:
        return <IncomingOrdersPage />;
    }
  };

  return (
    <>
      <DashboardStyles />
      <div className="dashboard-container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          <Header onLogout={logout} />
          <div className="page-content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
