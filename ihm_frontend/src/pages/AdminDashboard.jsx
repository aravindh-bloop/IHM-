import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Eye, Plus, Users, Clock, LogOut, CheckCircle, AlertCircle, Download, Moon, Sun } from 'lucide-react';
import { adminAPI } from '../services/api';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const DashboardStyles = () => (
  <style>{`
    .dashboard-container {
      display: flex;
      height: 100vh;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      overflow: hidden;
    }

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
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      animation: fadeIn 0.4s ease-out forwards;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .stat-label {
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .stat-value {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--primary-700);
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

    .btn-danger {
      background: var(--danger-600);
    }

    .btn-danger:hover {
      background: var(--danger-700);
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

    .status-approved {
      background: var(--success-50);
      color: var(--success-700);
    }

    .status-rejected {
      background: var(--danger-50);
      color: var(--danger-700);
    }

    .status-completed {
      background: var(--success-50);
      color: var(--success-700);
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

      .form-grid {
        grid-template-columns: 1fr;
      }

      .card {
        padding: var(--spacing-md);
      }
    }
  `}</style>
);

const Sidebar = ({ activePage, setActivePage }) => {
  const links = [
    { id: 'view-orders', label: 'View Orders', icon: Eye },
    { id: 'vendor-status', label: 'Vendor Status', icon: AlertCircle },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'create-account', label: 'Create Account', icon: Plus }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">FUMU</div>
        <div className="sidebar-subtitle">Admin Portal</div>
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
  
  return (
    <header className="header">
      <h2 className="header-title">Welcome, Admin</h2>
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

const ViewOrdersPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [approvedOrders, setApprovedOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [compiling, setCompiling] = React.useState(false);

  React.useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading pending and approved orders...');
      const response = await adminAPI.getPendingOrders();
      console.log('Full response:', response);
      console.log('Raw requests:', response.raw_requests);
      
      const pendingReqs = response.raw_requests?.filter(r => r.status === 'pending') || [];
      const approvedReqs = response.raw_requests?.filter(r => r.status === 'approved') || [];
      
      console.log('Pending orders count:', pendingReqs.length);
      console.log('Approved orders count:', approvedReqs.length);
      console.log('Approved orders:', approvedReqs);
      
      setOrders(pendingReqs);
      setApprovedOrders(approvedReqs);
    } catch (error) {
      console.error('Error loading pending orders:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to load pending orders';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCompileOrders = async () => {
    if (approvedOrders.length === 0) {
      toast.error('No approved orders to compile');
      return;
    }

    try {
      setCompiling(true);
      console.log('Compiling approved orders...');
      
      // Group items by name and unit
      const mergedItems = {};
      approvedOrders.forEach(order => {
        const key = `${order.item_name}_${order.unit}`;
        if (mergedItems[key]) {
          mergedItems[key].total_quantity += order.approved_quantity || order.quantity;
        } else {
          mergedItems[key] = {
            item_name: order.item_name,
            total_quantity: order.approved_quantity || order.quantity,
            unit: order.unit
          };
        }
      });

      const compilePayload = {
        items: Object.values(mergedItems)
      };
      
      console.log('Compile payload:', compilePayload);
      const response = await adminAPI.compileOrder(compilePayload);
      console.log('Compile response:', response);
      
      toast.success(`Orders compiled! Total items: ${Object.values(mergedItems).length}`);
      loadPendingOrders();
    } catch (error) {
      console.error('Error compiling orders:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to compile orders';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Manage Orders</h1>
        <p className="page-description">Review pending orders, approve/reject, and compile to send to vendor.</p>
      </div>

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
            onClick={loadPendingOrders}
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

      {/* Pending Orders Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>Pending Orders</h2>
        {loading ? (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading orders...
          </div>
        ) : orders.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Stall</th>
                  <th>Kitchen</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.stall_name}</td>
                    <td>{order.kitchen}</td>
                    <td>{order.item_name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.unit}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-small btn-success"
                          onClick={async () => {
                            try {
                              console.log('Approving order:', order.id);
                              console.log('Order data:', order);
                              const response = await adminAPI.updateRequestStatus(order.id, { status: 'approved', approved_quantity: order.quantity });
                              console.log('Approval response:', response);
                              console.log('Order approved successfully');
                              toast.success('Order approved!');
                              // Add delay to ensure database is updated
                              await new Promise(resolve => setTimeout(resolve, 500));
                              loadPendingOrders();
                            } catch (error) {
                              console.error('Error approving:', error);
                              console.error('Error response:', error.response?.data);
                              toast.error(`Error: ${error.response?.data?.detail || error.message}`);
                            }
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={async () => {
                            try {
                              console.log('Rejecting order:', order.id);
                              await adminAPI.updateRequestStatus(order.id, { status: 'rejected' });
                              console.log('Order rejected successfully');
                              toast.success('Order rejected!');
                              loadPendingOrders();
                            } catch (error) {
                              console.error('Error rejecting:', error);
                              toast.error(`Error: ${error.response?.data?.detail || error.message}`);
                            }
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No pending orders to review.
          </div>
        )}
      </div>

      {/* Approved Orders Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Approved Orders ({approvedOrders.length})</h2>
          {approvedOrders.length > 0 && (
            <button 
              className="btn btn-success"
              onClick={handleCompileOrders}
              disabled={compiling}
              style={{ background: 'linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%)' }}
            >
              {compiling ? 'Compiling...' : 'Compile & Send to Vendor'}
            </button>
          )}
        </div>
        {approvedOrders.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Stall</th>
                  <th>Kitchen</th>
                  <th>Item</th>
                  <th>Approved Qty</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.stall_name}</td>
                    <td>{order.kitchen}</td>
                    <td>{order.item_name}</td>
                    <td>{order.approved_quantity || order.quantity}</td>
                    <td>{order.unit}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No approved orders. Approve pending orders first.
          </div>
        )}
      </div>
    </div>
  );
};

const VendorStatusPage = () => {
  const [compiledOrders, setCompiledOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  React.useEffect(() => {
    loadVendorStatus();
  }, []);

  const loadVendorStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading compiled orders...');
      const response = await adminAPI.getCompiledOrders();
      console.log('Compiled orders response:', response);
      console.log('Response length:', response ? response.length : 0);
      if (response && response.length > 0) {
        console.log('First order:', response[0]);
        console.log('First order items:', response[0].items);
        console.log('Items count:', response[0].items ? response[0].items.length : 0);
      }
      setCompiledOrders(response || []);
    } catch (error) {
      console.error('Error loading compiled orders:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to load vendor status';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Vendor Status</h1>
        <p className="page-description">Track compiled orders sent to vendors and their delivery status.</p>
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
              onClick={loadVendorStatus}
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
            Loading compiled orders...
          </div>
        ) : compiledOrders.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items Count</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {compiledOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id.substring(0, 12)}...</strong></td>
                    <td>{order.total_items}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-small" 
                        style={{ fontSize: 'var(--text-xs)' }}
                        onClick={() => {
                          console.log('Viewing order details:', order.id);
                          console.log('Order object:', order);
                          console.log('Order items:', order.items);
                          console.log('Items count:', order.items ? order.items.length : 0);
                          if (order.items && order.items.length > 0) {
                            console.log('First item details:', order.items[0]);
                            console.log('First item unit_price:', order.items[0].unit_price);
                            console.log('First item total_price:', order.items[0].total_price);
                          }
                          setSelectedOrder(order);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No compiled orders sent to vendors yet. Compile and approve orders first.
          </div>
        )}
      </div>

      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           background: 'var(--overlay-bg)',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 1000,
           padding: 'var(--spacing-lg)'
         }}
        onClick={() => setSelectedOrder(null)}
        >
          <div 
            ref={(element) => window.receiptElement = element}
            data-receipt="true"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
               background: 'white',
               borderRadius: 'var(--radius-lg)',
               boxShadow: '0 20px 60px var(--shadow-color-light)'
             }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Receipt Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)',
              color: 'white',
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              borderBottom: '3px solid var(--primary-700)'
            }}>
              <h1 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: '28px', fontWeight: 700 }}>ORDER RECEIPT</h1>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>FUMU - Food Management System</p>
            </div>

            {/* Receipt Content */}
            <div style={{ padding: 'var(--spacing-xl)' }}>
              {/* Order Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Order ID</p>
                  <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, wordBreak: 'break-all' }}>{selectedOrder.id}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Date</p>
                  <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '14px', fontWeight: 600 }}>{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Status</p>
                  <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`} style={{ marginTop: 'var(--spacing-xs)', display: 'inline-block' }}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Total Items</p>
                  <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '20px', fontWeight: 700, color: 'var(--primary-600)' }}>{selectedOrder.total_items}</p>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: 'var(--text-muted)' }}>Order Items</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        background: 'var(--bg-secondary)', 
                        borderBottom: '2px solid var(--border-color)',
                        position: 'sticky',
                        top: 0
                      }}>
                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 700, color: 'var(--text-muted)' }}>Item</th>
                        <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', fontWeight: 700, color: 'var(--text-muted)' }}>Qty</th>
                        <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', fontWeight: 700, color: 'var(--text-muted)' }}>Delivered</th>
                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', fontWeight: 700, color: 'var(--text-muted)' }}>Unit Price</th>
                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', fontWeight: 700, color: 'var(--text-muted)' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx} style={{ 
                            borderBottom: '1px solid var(--border-color)',
                            background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'transparent'
                          }}>
                            <td style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>{item.item_name}</td>
                            <td style={{ textAlign: 'center', padding: 'var(--spacing-md)', fontWeight: 500 }}>{item.total_quantity}</td>
                            <td style={{ 
                              textAlign: 'center', 
                              padding: 'var(--spacing-md)', 
                              color: item.delivered_quantity > 0 ? 'var(--success-600)' : 'var(--text-muted)',
                              fontWeight: 600
                            }}>
                              {item.delivered_quantity || 0}
                            </td>
                            <td style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>
                              {item.unit_price ? `₹${item.unit_price.toFixed(2)}` : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'right', padding: 'var(--spacing-md)', fontWeight: 600, color: 'var(--primary-600)' }}>
                              {item.total_price ? `₹${item.total_price.toFixed(2)}` : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>No items in this order</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-xl)',
                borderLeft: '4px solid var(--primary-500)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ fontWeight: 600 }}>Total Price:</span>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary-600)' }}>
                    {selectedOrder.total_price ? `₹${selectedOrder.total_price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>Total Items:</span>
                  <span style={{ fontWeight: 600 }}>{selectedOrder.total_items}</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-lg)',
                borderTop: '1px dashed var(--border-color)',
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--text-muted)',
                fontSize: '12px'
              }}>
                <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>Thank you for using FUMU</p>
                <p style={{ margin: 0 }}>Generated on {new Date().toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-lg)',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)'
            }}>
              <button 
                onClick={() => {
                  console.log('Generating PDF...');
                  try {
                    // Create isolated print window for PDF
                    const printWindow = window.open('', '', 'height=800,width=900');
                    
                    const receiptHTML = `<!DOCTYPE html>
                      <html>
                      <head>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font-family: Arial, sans-serif; background: white; color: #000; padding: 20px; }
                          .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; margin-bottom: 20px; }
                          .header h1 { font-size: 24px; margin-bottom: 5px; }
                          .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
                          .info-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                          .info-table td:first-child { font-weight: 600; width: 40%; }
                          .items-table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 20px 0; }
                          .items-table th { background: #f3f4f6; padding: 10px; text-align: left; font-weight: 700; border: 1px solid #d1d5db; }
                          .items-table td { padding: 10px; border: 1px solid #e5e7eb; }
                          .items-table tr:nth-child(even) { background: #f9fafb; }
                          .summary { background: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; }
                          .summary div { display: flex; justify-content: space-between; margin: 5px 0; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1>ORDER RECEIPT</h1>
                          <p>FUMU - Food Management System</p>
                        </div>
                        <table class="info-table">
                          <tr><td>Order ID:</td><td>${selectedOrder.id}</td></tr>
                          <tr><td>Date:</td><td>${new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}</td></tr>
                          <tr><td>Status:</td><td>${selectedOrder.status.toUpperCase()}</td></tr>
                          <tr><td>Total Items:</td><td>${selectedOrder.total_items}</td></tr>
                        </table>
                        <h3 style="margin: 20px 0 10px; font-size: 12px; color: #6b7280;">ORDER ITEMS</h3>
                        <table class="items-table">
                          <tr><th>Item</th><th>Qty</th><th>Delivered</th><th>Unit Price</th><th>Total</th></tr>
                          ${selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map(item => `
                            <tr>
                              <td>${item.item_name}</td>
                              <td style="text-align: center;">${item.total_quantity}</td>
                              <td style="text-align: center;">${item.delivered_quantity || 0}</td>
                              <td style="text-align: right;">₹${item.unit_price ? item.unit_price.toFixed(2) : 'N/A'}</td>
                              <td style="text-align: right; font-weight: 600;">₹${item.total_price ? item.total_price.toFixed(2) : 'N/A'}</td>
                            </tr>
                          `).join('') : '<tr><td colspan="5">No items</td></tr>'}
                        </table>
                        <div class="summary">
                          <div><span>Total Price:</span><span style="font-weight: 700; color: #4f46e5;">₹${selectedOrder.total_price ? selectedOrder.total_price.toFixed(2) : 'N/A'}</span></div>
                        </div>
                        <p style="text-align: center; margin-top: 20px; font-size: 11px; color: #6b7280;">Generated: ${new Date().toLocaleString('en-IN')}</p>
                      </body></html>`;
                    
                    printWindow.document.write(receiptHTML);
                    printWindow.document.close();
                    
                    setTimeout(() => {
                      printWindow.print();
                      console.log('Print dialog opened - user can save as PDF');
                    }, 300);
                  } catch (error) {
                    console.error('Error:', error);
                    alert(`Error: ${error.message}`);
                  }
                }}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'var(--success-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--success-700)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--success-600)'}
              >
                📥 Download PDF
              </button>
              <button 
                onClick={() => {
                  console.log('Opening print dialog...');
                  try {
                    // Add a small delay to ensure the DOM is ready
                    setTimeout(() => {
                      window.print();
                    }, 100);
                  } catch (error) {
                    console.error('Error printing:', error);
                    alert(`Error: ${error.message}`);
                  }
                }}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'var(--info-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--info-700)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--info-600)'}
              >
                🖨️ Print
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--bg-primary)'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading order history...');
      const response = await adminAPI.getCompiledOrders();
      console.log('Order history response:', response);
      setHistory(response || []);
    } catch (error) {
      console.error('Error loading order history:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to load history';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Order History</h1>
        <p className="page-description">View all historical orders and their status.</p>
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
        {loading ? (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading history...
          </div>
        ) : history.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id.substring(0, 8)}...</strong></td>
                    <td>{order.total_items}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.total_price || 'N/A'}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No order history found.
          </div>
        )}
      </div>
    </div>
  );
};

const CreateAccountPage = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    role: 'stall',
    kitchen: '',
    stall_name: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: 'Email and password are required' });
        setLoading(false);
        return;
      }

      if (formData.role === 'stall' && !formData.kitchen) {
        setMessage({ type: 'error', text: 'Please select a kitchen for Chef role' });
        setLoading(false);
        return;
      }

      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'stall') {
        userData.kitchen = formData.kitchen;
        userData.stall_name = formData.stall_name || formData.kitchen;
      }

      const response = await authAPI.registerUser(userData);

      setMessage({ 
        type: 'success', 
        text: `Account created successfully for ${response.email}` 
      });

      setFormData({
        email: '',
        password: '',
        role: 'stall',
        kitchen: '',
        stall_name: ''
      });
    } catch (error) {
      console.error('Account creation error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create account';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Create User Account</h1>
        <p className="page-description">Create new user accounts for staff, admins, and vendors.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {message.text && (
          <div style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            background: message.type === 'success' ? 'var(--success-50)' : 'var(--danger-50)',
            border: `1px solid ${message.type === 'success' ? 'var(--success-200)' : 'var(--danger-200)'}`,
            color: message.type === 'success' ? 'var(--success-700)' : 'var(--danger-700)',
            fontSize: 'var(--text-sm)'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={loading}
            >
              <option value="stall">Chef (Stall)</option>
              <option value="admin">Administrator</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {formData.role === 'stall' && (
            <>
              <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="kitchen" className="form-label">Kitchen Assignment</label>
                <select
                  id="kitchen"
                  className="form-select"
                  value={formData.kitchen}
                  onChange={(e) => setFormData({ ...formData, kitchen: e.target.value })}
                  required
                  disabled={loading}
                >
                  <option value="">Select Kitchen</option>
                  <option value="BTK">BTK Kitchen</option>
                  <option value="ATK">ATK Kitchen</option>
                  <option value="QTK">QTK Kitchen</option>
                  <option value="CRAFT">CRAFT Kitchen</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="stall_name" className="form-label">Stall Name (Optional)</label>
                <input
                  id="stall_name"
                  type="text"
                  className="form-input"
                  placeholder="Stall name (defaults to kitchen)"
                  value={formData.stall_name}
                  onChange={(e) => setFormData({ ...formData, stall_name: e.target.value })}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            <Plus size={18} />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activePage, setActivePage] = React.useState('view-orders');
  const { logout } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'view-orders':
        return <ViewOrdersPage />;
      case 'vendor-status':
        return <VendorStatusPage />;
      case 'history':
        return <HistoryPage />;
      case 'create-account':
        return <CreateAccountPage />;
      default:
        return <ViewOrdersPage />;
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
