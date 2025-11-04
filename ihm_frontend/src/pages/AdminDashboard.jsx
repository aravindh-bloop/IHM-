import React from 'react';
import { useAuth } from '../context/AuthContext';

// --- STYLES COMPONENT (Added styles for total price box) --- //
const DashboardStyles = () => (
  <style>{`
    :root { /* CSS Variables (Unchanged) */
      --primary-blue: #5b21b6;
      --primary-blue-dark: #3b0764;
      --bg-gray: #e9d5ff;
      --text-dark: #0f172a;
      --text-light: #334155;
      --text-muted: #64748b;
      --border-color: #9f8bf5;
      --white: #f5e1ff;
      --red: #dc2626;
      --red-dark: #991b1b;
      --green: #16a34a;
      --green-dark: #15803d;
      --shadow: 0 6px 10px rgba(30, 58, 138, 0.15);
      --font-family: 'Poppins', 'Inter', 'Segoe UI', Roboto, sans-serif;
    }

    body { /* Body Styles (Unchanged) */
      font-family: var(--font-family);
      margin: 0;
      background-color: var(--bg-gray);
    }

    .dashboard-container { /* Container Styles (Unchanged) */
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-gray);
    }

    /* Sidebar (Unchanged) */
    .sidebar { width: 256px; background-color: var(--white); box-shadow: var(--shadow); display: flex; flex-direction: column; flex-shrink: 0; z-index: 10; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
    .sidebar-title { font-size: 1.875rem; font-weight: 700; color: var(--primary-blue); letter-spacing: 0.05em; }
    .sidebar-subtitle { font-size: 0.875rem; color: var(--text-muted); }
    .sidebar-nav { flex-grow: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-link { display: flex; align-items: center; padding: 0.75rem 1rem; color: var(--text-dark); border-radius: 0.5rem; transition: all 0.2s ease-in-out; cursor: pointer; border: none; background: none; text-align: left; font-family: inherit; font-size: inherit; width: 100%; }
    .sidebar-link svg { width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; flex-shrink: 0; }
    .sidebar-link:hover { background-color: #f3f4f6; }
    .sidebar-link.active { background-color: var(--primary-blue); color: var(--white); }

    /* Main Content Area (Unchanged) */
    .main-content { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }

    /* Header (Unchanged) */
    .header { background-color: var(--white); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
    .header-title { font-size: 1.25rem; font-weight: 600; color: var(--text-dark); }
    .btn-logout { background-color: var(--red); color: var(--white); font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem; }
    .btn-logout svg { width: 1.1rem; height: 1.1rem; }
    .btn-logout:hover { background-color: var(--red-dark); }

    /* Page Content Area (Unchanged) */
    .page-content { padding: 1.5rem; flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; }

    /* Card (Unchanged) */
    .card { background-color: var(--white); padding: 1.5rem; border-radius: 0.75rem; box-shadow: var(--shadow); width: 100%; box-sizing: border-box; }

    /* Generic Button (Unchanged) */
    .btn { background-color: var(--primary-blue); color: var(--white); font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background-color 0.2s; font-size: 1rem; box-sizing: border-box; }
    .btn:hover { background-color: var(--primary-blue-dark); }
    .btn-green { background-color: var(--green); }
    .btn-green:hover { background-color: var(--green-dark); }
    .btn:disabled { background-color: #9ca3af; cursor: not-allowed; opacity: 0.7; }
    /* --- Make Create Account button full width --- */
    .create-account-btn { width: 100%; display: block; }


    /* Form Styles (Unchanged) */
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 500; color: var(--text-light); font-size: 0.875rem; }
    .form-group input, .form-group select { padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; font-size: 1rem; width: 100%; box-sizing: border-box; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-blue); box-shadow: 0 0 0 2px rgba(91, 33, 182, 0.3); }

    /* Page Title/Description (Unchanged) */
    .page-title { margin-bottom: 0.5rem; font-size: 1.5rem; font-weight: 600; color: var(--text-dark); }
    .page-description { margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.9rem; }

    /* Success Message (Unchanged) */
    .success-msg { color: var(--green-dark); background-color: #dcfce7; border: 1px solid var(--green); padding: 0.75rem 1rem; border-radius: 0.375rem; font-weight: 500; margin-top: 1.5rem; text-align: center; font-size: 0.9rem; }

    /* Table Styles (Unchanged) */
    .table-container { overflow-x: auto; width: 100%; }
    .table { width: 100%; border-collapse: collapse; min-width: 600px; font-size: 0.875rem; }
    .table th, .table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
    .table th { font-weight: 600; color: var(--text-light); background-color: #f3e8ff; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .table tbody tr:hover { background-color: #faf5ff; }
    .table-empty-row td { text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; border-bottom: none; }
    .status-badge { padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; text-transform: capitalize; background-color: #fef9c3; color: #854d0e; display: inline-block; }
    .table-footer { margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .verify-all-container { display: flex; align-items: center; gap: 0.5rem; cursor: pointer;}
    .verify-all-container input[type="checkbox"] { width: 1.1rem; height: 1.1rem; cursor: pointer; }
    .verify-all-container label { font-size: 0.9rem; font-weight: 500; color: var(--text-dark); cursor: pointer; }

    /* Vendor Status Page Styles (Unchanged) */
    .status-available { color: var(--green-dark); font-weight: 600; }
    .status-unavailable { color: var(--red-dark); font-weight: 600; }
    /* --- ADDED: Total Price Box Style --- */
    .total-price-box {
        margin-top: 1.5rem;
        margin-left: auto; /* Align to the right */
        padding: 1rem 1.5rem;
        background-color: var(--white);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-dark);
        display: inline-block; /* Fit content width */
        min-width: 150px; /* Minimum width */
        text-align: right;
    }
    .total-price-box span {
        font-weight: 700;
        color: var(--primary-blue);
    }


    /* Media Queries (Unchanged) */
    @media (max-width: 768px) {
      .sidebar { }
      .header { padding: 0.75rem 1rem; }
      .page-content { padding: 1rem; }
      .card { padding: 1rem; }
      .btn { padding: 0.75rem 1rem; }
      .table-footer { justify-content: center; }
      .total-price-box { margin-left: 0; width: 100%; text-align: center; } /* Full width on mobile */
    }

  `}</style>
);

// --- SVG icons (Unchanged) ---
const ViewOrdersIcon = () => ( /* ... icon svg ... */ <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>);
const HistoryIcon = () => ( /* ... icon svg ... */ <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);
const UserAddIcon = () => ( /* ... icon svg ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /> </svg>);
const LogoutIcon = () => ( /* ... icon svg ... */ <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>);
const StatusIcon = () => ( /* ... icon svg ... */ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>);

// --- Sidebar (Unchanged) ---
const Sidebar = ({ activePage, setActivePage }) => { /* ... sidebar jsx ... */ const linkClasses = (page) => `sidebar-link ${activePage === page ? 'active' : ''}`; return ( <aside className="sidebar"> <div className="sidebar-header"> <h1 className="sidebar-title">FUMU</h1> <p className="sidebar-subtitle">Admin Portal</p> </div> <nav className="sidebar-nav"> <button onClick={() => setActivePage('view-orders')} className={linkClasses('view-orders')}> <ViewOrdersIcon /> View Orders </button> <button onClick={() => setActivePage('vendor-status')} className={linkClasses('vendor-status')}> <StatusIcon /> Vendor Status </button> <button onClick={() => setActivePage('history')} className={linkClasses('history')}> <HistoryIcon /> Order History </button> <button onClick={() => setActivePage('create-account')} className={linkClasses('create-account')}> <UserAddIcon /> Create Account </button> </nav> </aside> );};

// --- Header (Unchanged) ---
const Header = ({ onLogout }) => ( /* ... header jsx ... */ <header className="header"> <h2 className="header-title">Welcome, Admin!</h2> <button className="btn-logout" onClick={onLogout}> <LogoutIcon /> Logout </button> </header>);

// --- UPDATED: View Orders Page (Removed Status Column) ---
const ViewOrdersPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isVerified, setIsVerified] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { adminAPI } = await import('../services/api');
      const data = await adminAPI.getPendingOrders();
      
      // Transform merged_items to display format
      const transformedOrders = data.merged_items?.map(item => ({
        itemName: item.item_name,
        quantity: `${item.total_quantity} ${item.unit}`,
        total_quantity: item.total_quantity,
        unit: item.unit
      })) || [];
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToVendor = async () => {
    setError('');
    setSuccess('');
    
    try {
      const { adminAPI } = await import('../services/api');
      
      // Prepare order data for compilation
      const orderData = {
        items: orders.map(order => ({
          item_name: order.itemName,
          total_quantity: order.total_quantity,
          unit: order.unit
        }))
      };
      
      const response = await adminAPI.compileOrder(orderData);
      setSuccess(response.message || 'Order sent to vendor successfully!');
      setIsVerified(false);
      
      // Refresh the orders list
      setTimeout(() => {
        fetchPendingOrders();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error sending order to vendor:', err);
      setError(err.response?.data?.detail || 'Failed to send order to vendor');
    }
  };

  return (
    <>
      <div>
        <h3 className="page-title">Verify Merged Orders</h3>
        <p className="page-description">Review the combined order list from all kitchens. Verify and send to the vendor.</p>
      </div>
      
      {error && (
        <p style={{
          color: 'var(--red-dark)',
          backgroundColor: '#fee2e2',
          border: '1px solid var(--red)',
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '500',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {error}
        </p>
      )}
      
      {success && <p className="success-msg">{success}</p>}
      
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-empty-row"><td colSpan="2">Loading orders...</td></tr>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={`${order.itemName}-${index}`}>
                    <td>{order.itemName}</td>
                    <td>{order.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr className="table-empty-row"><td colSpan="2">No pending orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {orders.length > 0 && (
          <div className="table-footer">
            <div className="verify-all-container" onClick={() => setIsVerified(!isVerified)}>
              <input
                type="checkbox"
                id="verify-all-checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
              />
              <label htmlFor="verify-all-checkbox">
                I have verified all items in this order.
              </label>
            </div>
            <button
              className="btn btn-green"
              onClick={handleSendToVendor}
              disabled={!isVerified}
            >
              Send to Vendor
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// --- UPDATED: Vendor Status Page (Shows compiled orders sent to vendor) ---
const VendorStatusPage = () => {
    const [compiledOrders, setCompiledOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        fetchCompiledOrders();
    }, []);

    const fetchCompiledOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const { adminAPI } = await import('../services/api');
            const data = await adminAPI.getCompiledOrders();
            setCompiledOrders(data || []);
        } catch (err) {
            console.error('Error fetching compiled orders:', err);
            setError('Failed to load compiled orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#f59e0b';
            case 'completed': return 'var(--green-dark)';
            case 'cancelled': return 'var(--red-dark)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <>
            <div>
                <h3 className="page-title">Compiled Orders Status</h3>
                <p className="page-description">View all compiled orders that have been sent to vendors.</p>
            </div>
            
            {error && (
                <p style={{
                    color: 'var(--red-dark)',
                    backgroundColor: '#fee2e2',
                    border: '1px solid var(--red)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </p>
            )}
            
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Date</th>
                                <th>Total Items</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="table-empty-row"><td colSpan="4">Loading compiled orders...</td></tr>
                            ) : compiledOrders.length > 0 ? (
                                compiledOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>{order.total_items}</td>
                                        <td>
                                            <span style={{ 
                                                color: getStatusColor(order.status), 
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.orders?.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85em', padding: '0.2em 0' }}>
                                                    {item.item_name}: {item.total_quantity}
                                                    {item.delivered_quantity && ` (Delivered: ${item.delivered_quantity})`}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row"><td colSpan="4">No compiled orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};


// Order History Page
const OrderHistoryPage = () => {
    const [history, setHistory] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        setLoading(true);
        setError('');
        try {
            const { adminAPI } = await import('../services/api');
            const data = await adminAPI.getCompiledOrders();
            setHistory(data || []);
        } catch (err) {
            console.error('Error fetching order history:', err);
            setError('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#f59e0b';
            case 'completed': return 'var(--green-dark)';
            case 'cancelled': return 'var(--red-dark)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <>
            <div>
                <h3 className="page-title">Order History</h3>
                <p className="page-description">View all compiled orders sent to vendors.</p>
            </div>
            
            {error && (
                <p style={{
                    color: 'var(--red-dark)',
                    backgroundColor: '#fee2e2',
                    border: '1px solid var(--red)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </p>
            )}
            
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Total Items</th>
                                <th>Status</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="table-empty-row"><td colSpan="4">Loading...</td></tr>
                            ) : history.length > 0 ? (
                                history.map((order) => (
                                    <tr key={order.id}>
                                        <td>{new Date(order.created_at).toLocaleString()}</td>
                                        <td>{order.total_items}</td>
                                        <td>
                                            <span style={{ 
                                                color: getStatusColor(order.status), 
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.orders?.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85em', padding: '0.2em 0' }}>
                                                    {item.item_name}: {item.total_quantity}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row"><td colSpan="4">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

// --- UPDATED: Create Account Page with API Integration ---
const CreateAccountPage = () => {
  const [role, setRole] = React.useState('stall');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [stallName, setStallName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const kitchens = ['BTK', 'ATK', 'QTK', 'CRAFT'];

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (role === 'stall' && !stallName) {
      setErrorMsg('Please select a kitchen for the chef');
      return;
    }

    setLoading(true);

    try {
      // Import authAPI dynamically to avoid circular dependency
      const { authAPI } = await import('../services/api');

      const userData = {
        email: email.trim(),
        password: password,
        role: role,
        is_active: true,
        is_superuser: false,
        is_verified: true,
      };

      // Add stall_name only for stall owners
      if (role === 'stall' && stallName) {
        userData.stall_name = stallName;
      }

      const response = await authAPI.registerUser(userData);

      setSuccessMsg(`✅ ${role === 'stall' ? 'Chef' : role.charAt(0).toUpperCase() + role.slice(1)} account created successfully for "${email}"${stallName ? ` at ${stallName} kitchen` : ''}`);
      
      // Reset form
      setEmail('');
      setPassword('');
      setStallName('');
      setRole('stall');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to create account. Please try again.';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h3 className="page-title">Create Login Accounts</h3>
        <p className="page-description">Admin can create Chef and Vendor login credentials here.</p>
      </div>
      <div
        className="card"
        style={{
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
         }}
      >
        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label htmlFor="role-select">Role *</label>
            <select 
              id="role-select" 
              value={role} 
              onChange={(e) => {
                setRole(e.target.value);
                setStallName(''); // Reset stall name when role changes
              }}
              disabled={loading}
            >
              <option value="stall">Chef</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {role === 'stall' && (
            <div className="form-group">
              <label htmlFor="kitchen-select">Kitchen *</label>
              <select
                id="kitchen-select"
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select Kitchen</option>
                {kitchens.map(kitchen => (
                  <option key={kitchen} value={kitchen}>{kitchen}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email-input">Email ID *</label>
            <input 
              id="email-input" 
              type="email" 
              value={email} 
              placeholder="Enter email ID" 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-input">Password *</label>
            <input 
              id="password-input" 
              type="password" 
              value={password} 
              placeholder="Enter password (min 3 characters)" 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading}
              required 
              minLength="3" 
            />
          </div>

          <button 
            className="btn create-account-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {errorMsg && (
          <p style={{
            color: 'var(--red-dark)',
            backgroundColor: '#fee2e2',
            border: '1px solid var(--red)',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontWeight: '500',
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {errorMsg}
          </p>
        )}

        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>
    </>
  );
};

// --- Main AdminDashboard Component (Unchanged) ---
export default function AdminDashboard() {
  const [activePage, setActivePage] = React.useState('view-orders');
  const { logout } = useAuth();
  const renderPage = () => {
    switch (activePage) {
      case 'view-orders': return <ViewOrdersPage />;
      case 'vendor-status': return <VendorStatusPage />;
      case 'history': return <OrderHistoryPage />;
      case 'create-account': return <CreateAccountPage />;
      default: return <ViewOrdersPage />;
    }
  };
  return (
    <>
      <DashboardStyles />
      <div className="dashboard-container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          <Header onLogout={logout} />
          <div className="page-content">{renderPage()}</div>
        </main>
      </div>
    </>
  );
}