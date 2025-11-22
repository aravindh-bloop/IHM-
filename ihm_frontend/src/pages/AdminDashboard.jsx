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

    /* Print Styles for Invoice */
    @media print {
      body * {
        visibility: hidden;
      }
      .invoice-modal, .invoice-modal * {
        visibility: visible;
      }
      .invoice-modal {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      button {
        display: none !important;
      }
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
  const [lastOrder, setLastOrder] = React.useState(null);
  const [loadingLastOrder, setLoadingLastOrder] = React.useState(true);

  React.useEffect(() => {
    fetchPendingOrders();
    fetchLastOrder();
  }, []);

  const fetchLastOrder = async () => {
    setLoadingLastOrder(true);
    try {
      const { adminAPI } = await import('../services/api');
      const compiledOrders = await adminAPI.getCompiledOrders();
      if (compiledOrders && compiledOrders.length > 0) {
        // Get the most recent order
        setLastOrder(compiledOrders[0]);
      }
    } catch (err) {
      console.error('Error fetching last order:', err);
    } finally {
      setLoadingLastOrder(false);
    }
  };

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

      // Refresh the orders list and last order
      setTimeout(() => {
        fetchPendingOrders();
        fetchLastOrder();
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

      {/* Last Order Status Section */}
      {lastOrder && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0f9ff', borderLeft: '4px solid var(--primary-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              Last Order Sent
            </h4>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: lastOrder.status === 'completed' ? '#dcfce7' : lastOrder.status === 'pending' ? '#fef3c7' : '#fee2e2',
              color: lastOrder.status === 'completed' ? '#166534' : lastOrder.status === 'pending' ? '#854d0e' : '#991b1b'
            }}>
              {lastOrder.status}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Date:</span>{' '}
              <span style={{ color: 'var(--text-dark)' }}>{new Date(lastOrder.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Items:</span>{' '}
              <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{lastOrder.total_items}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Price:</span>{' '}
              <span style={{ color: lastOrder.total_price ? 'var(--green-dark)' : 'var(--text-muted)', fontWeight: 600 }}>
                {lastOrder.total_price ? `₹${lastOrder.total_price.toFixed(2)}` : 'Pending'}
              </span>
            </div>
          </div>
          {lastOrder.orders && lastOrder.orders.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Items:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {lastOrder.orders.map((item, idx) => (
                  <span key={idx} style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--white)',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-dark)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {item.item_name} ({item.delivered_quantity || item.total_quantity} {item.unit || 'kg'})
                    {item.total_price && <span style={{ color: 'var(--green-dark)', marginLeft: '0.25rem' }}>₹{item.total_price.toFixed(2)}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

// --- Invoice Modal Component ---
const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalAmount = order.total_price || 0;
  const currentDate = new Date().toLocaleDateString();
  const orderDate = new Date(order.created_at).toLocaleDateString();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="invoice-modal" style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Invoice Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '2px solid var(--primary-blue)',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-blue)', margin: 0 }}>
                INVOICE
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>FUMU - Food Management System</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                <strong>Invoice #:</strong> {order.id.substring(0, 8).toUpperCase()}
              </p>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                <strong>Date:</strong> {currentDate}
              </p>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                <strong>Order Date:</strong> {orderDate}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: '2rem' }}>
          {/* Order Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem'
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Order Status
              </p>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: order.status === 'completed' ? '#dcfce7' : order.status === 'pending' ? '#fef3c7' : '#fee2e2',
                color: order.status === 'completed' ? '#166534' : order.status === 'pending' ? '#854d0e' : '#991b1b'
              }}>
                {order.status}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Total Items
              </p>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                {order.total_items}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Vendor ID
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark)', margin: 0 }}>
                {order.vendor_id ? order.vendor_id.substring(0, 8).toUpperCase() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '2rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Item Name
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Quantity
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Delivered
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Unit Price
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.orders?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    <strong>{item.item_name}</strong>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {item.total_quantity} {item.unit || 'kg'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {item.delivered_quantity ? `${item.delivered_quantity} ${item.unit || 'kg'}` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {item.unit_price ? `₹${item.unit_price.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                    {item.total_price ? `₹${item.total_price.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem'
          }}>
            <div style={{ minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                  {totalAmount > 0 ? `₹${totalAmount.toFixed(2)}` : 'Pending'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid var(--primary-blue)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>Total Amount:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {totalAmount > 0 ? `₹${totalAmount.toFixed(2)}` : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid var(--primary-blue)',
            borderRadius: '0.375rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-dark)', margin: 0 }}>
              <strong>Note:</strong> This is a system-generated invoice for internal tracking purposes.
              {!totalAmount && ' Prices are pending vendor confirmation.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          backgroundColor: '#f9fafb'
        }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Print Invoice
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED: Vendor Status Page (Shows compiled orders sent to vendor) ---
const VendorStatusPage = () => {
    const [compiledOrders, setCompiledOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [selectedOrder, setSelectedOrder] = React.useState(null);

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
                                <th>Total Price</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="table-empty-row"><td colSpan="6">Loading compiled orders...</td></tr>
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
                                        <td style={{ fontWeight: 600, color: order.total_price ? 'var(--green-dark)' : 'var(--text-muted)' }}>
                                            {order.total_price ? `₹${order.total_price.toFixed(2)}` : 'Pending'}
                                        </td>
                                        <td>
                                            {order.orders?.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85em', padding: '0.2em 0' }}>
                                                    {item.item_name}: {item.total_quantity} {item.unit || 'kg'}
                                                    {item.delivered_quantity && ` (Delivered: ${item.delivered_quantity} ${item.unit || 'kg'})`}
                                                    {item.unit_price && ` @ ₹${item.unit_price}/${item.unit || 'unit'}`}
                                                    {item.total_price && ` = ₹${item.total_price.toFixed(2)}`}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: 'var(--primary-blue)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                View Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row"><td colSpan="6">No compiled orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Modal */}
            {selectedOrder && (
                <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </>
    );
};


// Order History Page
const OrderHistoryPage = () => {
    const [history, setHistory] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [selectedOrder, setSelectedOrder] = React.useState(null);

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="table-empty-row"><td colSpan="5">Loading...</td></tr>
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
                                                    {item.item_name}: {item.total_quantity} {item.unit || 'kg'}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: 'var(--primary-blue)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                View Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row"><td colSpan="5">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Modal */}
            {selectedOrder && (
                <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
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
  const [kitchens, setKitchens] = React.useState([]);
  const [loadingKitchens, setLoadingKitchens] = React.useState(true);

  // Fetch kitchens on mount
  React.useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const { authAPI } = await import('../services/api');
        const data = await authAPI.getKitchens();
        setKitchens(data);
      } catch (error) {
        console.error('Failed to fetch kitchens:', error);
        // Fallback to hardcoded kitchens if API fails
        setKitchens(['ATK', 'BTK', 'QTK', 'CRAFT']);
      } finally {
        setLoadingKitchens(false);
      }
    };
    fetchKitchens();
  }, []);

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

      // Generate success message based on role
      let successMessage = '✅ ';
      if (role === 'stall') {
        successMessage += `Chef account created successfully for "${email}"`;
        if (stallName) {
          successMessage += ` at ${stallName} kitchen`;
        }
      } else if (role === 'admin') {
        successMessage += `Admin account created successfully for "${email}"`;
      } else {
        successMessage += `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully for "${email}"`;
      }
      
      setSuccessMsg(successMessage);
      
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
        <p className="page-description">Admin can create Chef, Vendor, and Admin login credentials here.</p>
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
              <option value="admin">Admin</option>
            </select>
            {role === 'admin' && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#5b21b6',
                backgroundColor: '#f0f9ff',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                borderLeft: '3px solid #5b21b6'
              }}>
                <strong>ℹ️ Note:</strong> Admin users will automatically receive invoice email notifications when vendors complete orders.
              </p>
            )}
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

      {/* Admin Users Info Section */}
      {role === 'admin' && (
        <div className="card" style={{ marginTop: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-dark)' }}>
            📧 Email Notifications
          </h4>
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #bfdbfe'
          }}>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: 'var(--text-dark)' }}>
              <strong>All admin users</strong> automatically receive invoice email notifications when vendors complete order processing.
            </p>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', marginTop: '0.75rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
              <li>New admin accounts will start receiving emails immediately</li>
              <li>Configure email settings in the backend .env file</li>
              <li>Each admin receives a copy of every invoice</li>
              <li>Emails include complete order details and pricing</li>
            </ul>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.375rem', border: '1px solid #fbbf24' }}>
            <p style={{ fontSize: '0.85rem', margin: 0, color: '#78350f' }}>
              <strong>⚠️ Important:</strong> Ensure new admin users have valid email addresses to receive notifications.
            </p>
          </div>
        </div>
      )}
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