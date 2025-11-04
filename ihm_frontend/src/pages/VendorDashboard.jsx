import React from 'react';
import { useAuth } from '../context/AuthContext';
import { vendorAPI } from '../services/api';

// --- STYLES COMPONENT (Simplified Statuses for Vendor) --- //
const DashboardStyles = () => (
  <style>{`
    :root {
      /* --- New Purple Theme Variables --- */
      --primary-blue: #5b21b6;        /* Main Purple */
      --primary-blue-dark: #3b0764;   /* Darker Purple */
      --bg-gray: #e9d5ff;            /* Light Purple Background */
      --text-dark: #1e1b4b;          /* Dark Indigo Text */
      --text-light: #6d28d9;         /* Lighter Purple Text */
      --text-muted: #7c7aa9;         /* Muted Purple Text */
      --border-color: #9f8bf5;       /* Purple Border */
      --white: #f5e1ff;              /* Very Light Purple/Off-White */
      --red: #dc2626;                /* Red (Unchanged) */
      --red-dark: #991b1b;           /* Darker Red (Updated) */
      --green: #22c55e;              /* Green (Unchanged) */
      --green-dark: #15803d;         /* Darker Green (Updated) */
      --shadow: 0 8px 16px rgba(93, 51, 177, 0.2); /* Updated Shadow */
      --font-family: 'Poppins', 'Inter', 'Segoe UI', Roboto, sans-serif; /* Updated Font */

      /* Variables used by Vendor buttons (mapping to new theme) */
      --purple: var(--primary-blue); /* Submit button uses main purple */
      --purple-dark: var(--primary-blue-dark); /* Hover uses darker purple */
    }
    
    body {
      font-family: var(--font-family);
      margin: 0;
    }
    
    .dashboard-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-gray);
    }

    /* --- Sidebar --- */
    .sidebar {
      width: 256px; /* 16rem */
      background-color: var(--white);
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .sidebar-title {
      font-size: 1.875rem; /* 3xl */
      font-weight: 700;
      color: var(--primary-blue);
      letter-spacing: 0.05em;
    }
    .sidebar-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .sidebar-nav {
      flex-grow: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: var(--text-dark);
      border-radius: 0.5rem;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      text-decoration: none;
    }
    .sidebar-link:hover {
      background-color: #f3f4f6;
    }
    .sidebar-link.active {
      background-color: var(--primary-blue);
      color: var(--white);
    }
    .sidebar-link svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.75rem;
    }

    /* --- Main Content --- */
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .header {
      background-color: var(--white);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      flex-shrink: 0;
    }
    .header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-dark);
    }
    .btn-logout {
      background-color: var(--red);
      color: var(--white);
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      border: none;
      cursor: pointer;
    }
    .btn-logout:hover {
      background-color: var(--red-dark);
    }
    .btn-logout svg {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.5rem;
    }

    .page-content {
      padding: 2rem;
      flex-grow: 1;
      overflow-y: auto;
    }
    
    .page-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-dark);
    }
    .page-description {
      color: var(--text-muted);
    }
    
    .card {
      background-color: var(--white);
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: var(--shadow);
    }

    /* --- Table --- */
    .table-container {
      overflow-x: auto;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px; 
    }
    .table-header {
      background-color: #f9fafb;
    }
    .table th {
      padding: 0.75rem 1rem; 
      text-align: left;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .table td {
      padding: 1rem 1rem; 
      border-top: 1px solid var(--border-color);
      font-size: 0.875rem;
      vertical-align: top;
    }
    .table-empty-row td {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }
    .table-body tr:first-child td {
      /* border-top: none; */ /* Remove this if using Order grouping */
    }
    .table-body {
      background-color: var(--white);
    }
    .table-cell-name {
      font-weight: 500;
      color: var(--text-dark);
      white-space: nowrap;
    }
    
    /* Vendor-specific styles */
    .item-breakdown {
        font-size: 0.8rem;
        color: var(--text-light);
        max-width: 250px; /* Limit width */
        white-space: normal; /* Allow wrapping */
    }
    .item-breakdown span {
        font-weight: 500;
    }
    .feedback-input {
        width: 100%;
        padding: 0.3rem 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    .availability-check {
        margin-right: 0.5rem;
        vertical-align: middle; /* Align checkbox nicely */
    }
    .availability-label {
        vertical-align: middle;
        margin-right: 1rem;
        white-space: nowrap;
    }

    .btn {
      background-color: var(--primary-blue);
      color: var(--white);
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
      display: inline-flex; 
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 5px; 
    }
    .btn:hover {
        opacity: 0.9;
    }
     .btn-full { /* Button that spans full width */
        display: flex;
        width: 100%;
        margin-top: 1rem;
        font-size: 1rem;
        padding: 0.75rem 1rem;
    }
    .btn-green {
      background-color: var(--green);
    }
    .btn-green:hover {
      background-color: var(--green-dark);
    }
     .btn-purple {
      background-color: var(--purple);
    }
    .btn-purple:hover {
      background-color: var(--purple-dark);
    }
    
    /* Order History */
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .history-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    /* --- Statuses for Vendor --- */
    .status-badge {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .status-pending { /* Incoming order for vendor */
      background-color: #dbeafe; /* Blue */
      color: #1e40af;
    }
    .status-completed { /* For history page - Green */
      background-color: #dcfce7; /* Green */
      color: #166534;
    }
    .status-cancelled { /* For history page - Red */
      background-color: #fee2e2; /* Light Red */
      color: #991b1b; /* Dark Red */
    }
    
  `}</style>
);


// --- SVG ICONS --- //
const InboxInIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H17"></path></svg>
);
const HistoryIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const LogoutIcon = () => (
   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);
const SendIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
);
// Removed CheckIcon, TruckIcon as they are not used in this simple version

// --- Sub-Components --- //

const Sidebar = ({ activePage, setActivePage }) => {
    const linkClasses = (page) => 
        `sidebar-link ${activePage === page ? 'active' : ''}`;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">FUMU</h1>
                <p className="sidebar-subtitle">Vendor Portal</p>
            </div>
            <nav className="sidebar-nav">
                <a onClick={() => setActivePage('incoming')} className={linkClasses('incoming')}>
                    <InboxInIcon /> Incoming Orders
                </a>
                <a onClick={() => setActivePage('history')} className={linkClasses('history')}>
                    <HistoryIcon /> Supply History
                </a>
            </nav>
        </aside>
    );
};

const Header = ({ onLogout }) => (
    <header className="header">
        <div>
            <h2 className="header-title">Welcome, Vendor!</h2>
        </div>
        <button className="btn-logout" onClick={onLogout}>
            <LogoutIcon /> Logout
        </button>
    </header>
);

// StatusBadge component for the Vendor (Simplified)
const StatusBadge = ({ status }) => {
    const statusClass = status.toLowerCase().replace(/ /g, '-'); 
    return <span className={`status-badge status-${statusClass || 'verified'}`}>{status}</span>;
};

// Component to render individual order rows with feedback inputs
const OrderFeedbackRow = ({ order, onFeedbackChange, onSubmitFeedback }) => {
    
    return (
         <tbody className="table-body">
            {/* Header Row for the Order */}
            <tr style={{backgroundColor: '#f9fafb', borderTop: '2px solid var(--border-color)'}}>
                 <td colSpan="2">
                    <span className="table-cell-name">Order ID: {order.orderId}</span> ({order.date})
                 </td>
                 <td><StatusBadge status={order.status} /></td>
                 <td colSpan="2"></td>
            </tr>
            {/* Item Rows for the Order */}
            {order.items.map((item) => (
                <tr key={item.id}>
                    <td className="table-cell-name">{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td></td>
                    <td colSpan="2">
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <label style={{fontWeight: '500', whiteSpace: 'nowrap'}}>Delivered:</label>
                            <input 
                                type="number" 
                                min="0"
                                max={item.quantity}
                                placeholder="Quantity delivered" 
                                className="feedback-input" 
                                style={{width: '150px', marginTop: 0}}
                                value={onFeedbackChange.getFeedback(order.orderId, item.id)?.deliveredQty ?? item.quantity}
                                onChange={(e) => onFeedbackChange.setFeedback(order.orderId, item.id, 'deliveredQty', parseInt(e.target.value) || 0)}
                            />
                            <span style={{color: 'var(--text-muted)'}}>{item.unit}</span>
                        </div>
                    </td>
                </tr>
            ))}
            {/* Row for Submit button */}
             <tr style={{borderTop: '1px solid var(--border-color)'}}>
                 <td colSpan="5" style={{textAlign: 'right', padding: '1rem'}}>
                    <button onClick={() => onSubmitFeedback(order.orderId)} className="btn btn-purple">
                        <SendIcon /> Update Order Status
                    </button>
                 </td>
             </tr>
        </tbody>
    );
};


const IncomingOrdersPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [feedback, setFeedback] = React.useState({}); // State to hold feedback

    React.useEffect(() => {
        fetchIncomingOrders();
    }, []);

    const fetchIncomingOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vendorAPI.getIncomingOrders();
            // Transform API response to match component structure
            const transformedOrders = response.map(order => ({
                orderId: order.order_id,
                date: new Date(order.date).toLocaleDateString(),
                status: order.status,
                totalItems: order.total_items,
                items: order.items.map(item => ({
                    id: item.item_id,
                    name: item.item_name,
                    quantity: item.total_quantity,
                    unit: 'kg', // You may need to add unit to backend
                    deliveredQty: item.delivered_quantity || 0
                }))
            }));
            setOrders(transformedOrders);
        } catch (err) {
            console.error('Error fetching incoming orders:', err);
            setError('Failed to load incoming orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        // TODO: Add real API call: vendorAPI.getIncomingOrders()
        const timer = setTimeout(() => {
            // Filter only verified orders for this simplified view
            setOrders(MOCK_INCOMING_ORDERS.filter(o => o.status === 'Verified')); 
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // --- Feedback State Management ---
    const getFeedback = (orderId, itemId) => {
        return feedback[orderId]?.[itemId];
    };

    const setFeedbackItem = (orderId, itemId, key, value) => {
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
    // --------------------------------

    // Placeholder action
    const handleSubmitFeedback = async (orderId) => {
        try {
            const orderFeedback = feedback[orderId] || {};
            const order = orders.find(o => o.orderId === orderId);
            
            // Build items array for API
            const items = order.items.map(item => ({
                item_id: item.id,
                delivered_quantity: orderFeedback[item.id]?.deliveredQty ?? item.quantity
            }));

            // Send to API
            await vendorAPI.updateOrderStatus(orderId, {
                items: items,
                mark_as_completed: true
            });

            alert(`Status sent to Admin successfully for Order ${orderId}`);
            // Refresh the orders list
            fetchIncomingOrders();
        } catch (err) {
            console.error('Error submitting feedback:', err);
            alert('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Incoming Orders from Admin</h3>
                <p className="page-description">Review verified orders and provide availability/price feedback.</p>
            </div>
            
            <div className="card">
                {loading ? (
                    <div className="table-empty-row" style={{border: 'none'}}>Loading incoming orders...</div>
                ) : error ? (
                    <div className="table-empty-row" style={{border: 'none', color: 'var(--red)'}}>
                        {error}
                        <button onClick={fetchIncomingOrders} className="btn" style={{marginTop: '1rem'}}>
                            Retry
                        </button>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead className="table-header">
                                <tr>
                                    <th>Item</th>
                                    <th>Total Qty Requested</th>
                                    <th>Status</th>
                                    <th colSpan="2">Delivered Quantity</th>
                                </tr>
                            </thead>
                            {/* Render each order using the OrderFeedbackRow component */}
                            {orders.map((order) => (
                                <OrderFeedbackRow 
                                    key={order.orderId} 
                                    order={order} 
                                    onFeedbackChange={{ 
                                        getFeedback, 
                                        setFeedback: setFeedbackItem
                                    }}
                                    onSubmitFeedback={handleSubmitFeedback}
                                />
                            ))}
                        </table>
                    </div>
                ) : (
                    <div className="table-empty-row" style={{border: 'none', paddingTop: '2rem', paddingBottom: '2rem'}}>
                        No incoming orders found requiring feedback.
                    </div>
                )}
            </div>
        </div>
    );
};

const SupplyHistoryPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
        fetchSupplyHistory();
    }, []);

    const fetchSupplyHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vendorAPI.getSupplyHistory();
            // Transform API response
            const transformedHistory = response.map(order => ({
                id: order.order_id,
                date: new Date(order.date).toLocaleDateString(),
                itemCount: order.item_count,
                status: order.status
            }));
            setOrders(transformedHistory);
        } catch (err) {
            console.error('Error fetching supply history:', err);
            setError('Failed to load supply history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Supply History</h3>
                <p className="page-description">Record of all completed and cancelled orders.</p>
            </div>
             <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {loading ? (
                                <tr className="table-empty-row">
                                    <td colSpan="4">Loading history...</td>
                                </tr>
                            ) : error ? (
                               <tr className="table-empty-row">
                                   <td colSpan="4" style={{color: 'var(--red)'}}>
                                       {error}
                                       <button onClick={fetchSupplyHistory} className="btn" style={{marginTop: '1rem'}}>
                                           Retry
                                       </button>
                                   </td>
                               </tr>
                           ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="table-cell-name">{order.id}</td>
                                        <td>{order.date}</td>
                                        <td>{order.itemCount} items</td>
                                        <td><StatusBadge status={order.status} /></td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row">
                                    <td colSpan="4">No supply history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- Main VendorDashboard Component --- //

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