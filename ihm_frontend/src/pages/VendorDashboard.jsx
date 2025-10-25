import React from 'react';
import { useAuth } from '../context/AuthContext';

// --- MOCK DATA FOR VENDOR (Simplified: Only Verified Orders) --- //
const MOCK_INCOMING_ORDERS = [
    {
        orderId: 'ORD-104',
        date: '2025-10-22',
        status: 'Verified', // Needs Vendor feedback
        items: [
            { id: 1, name: 'Onion', quantity: 57, unit: 'kg', breakdown: { BTK: 20, ATK: 15, QTK: 10, CRAFT: 12 } },
            { id: 2, name: 'Tomato', quantity: 40, unit: 'kg', breakdown: { BTK: 15, ATK: 10, QTK: 10, CRAFT: 5 } },
            { id: 3, name: 'Basmati Rice', quantity: 50, unit: 'kg', breakdown: { BTK: 20, ATK: 15, QTK: 10, CRAFT: 5 } }
        ]
    },
     {
        orderId: 'ORD-103',
        date: '2025-10-21',
        status: 'Verified', // Needs Vendor feedback
        items: [
             { id: 4, name: 'Cooking Oil', quantity: 15, unit: 'liters', breakdown: {ATK: 10, CRAFT: 5} },
             { id: 5, name: 'Wheat Flour', quantity: 100, unit: 'kg', breakdown: {BTK: 50, QTK: 50} },
        ]
    },
];

const MOCK_SUPPLY_HISTORY = [
    { id: 'ORD-101', date: '2025-10-21', itemCount: 12, status: 'Supplied' },
    { id: 'ORD-100', date: '2025-10-19', itemCount: 8, status: 'Not Supplied' },
    { id: 'ORD-099', date: '2025-10-18', itemCount: 20, status: 'Supplied' },
];


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
    .status-verified { /* Incoming order for vendor */
      background-color: #dbeafe; /* Blue */
      color: #1e40af;
    }
    .status-supplied { /* For history page - Green */
      background-color: #dcfce7; /* Green */
      color: #166534;
    }
    .status-not-supplied { /* For history page - Red */
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
    
    // Helper to format kitchen breakdown string
    const formatBreakdown = (breakdown) => {
        return Object.entries(breakdown)
                     .map(([kitchen, qty]) => `${kitchen}: ${qty}`)
                     .join(', ');
    };

    return (
         <tbody className="table-body">
            {/* Header Row for the Order */}
            <tr style={{backgroundColor: '#f9fafb', borderTop: '2px solid var(--border-color)'}}>
                 <td colSpan="3">
                    <span className="table-cell-name">Order ID: {order.orderId}</span> ({order.date})
                 </td>
                 <td><StatusBadge status={order.status} /></td> {/* Status Column */}
                 <td> {/* Action Column */}
                    {/* The Submit button is now outside the row, at the end of the order */}
                 </td>
            </tr>
            {/* Item Rows for the Order */}
            {order.items.map((item, ) => (
                <tr key={item.id}>
                    <td className="table-cell-name">{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td className="item-breakdown">{formatBreakdown(item.breakdown)}</td>
                    <td colSpan="2"> {/* Feedback column spans Status and Actions */}
                        <div>
                            <input 
                                type="checkbox" 
                                id={`avail-${order.orderId}-${item.id}`} 
                                className="availability-check"
                                checked={onFeedbackChange.getFeedback(order.orderId, item.id)?.available ?? true} // Default to available
                                onChange={(e) => onFeedbackChange.setFeedback(order.orderId, item.id, 'available', e.target.checked)}
                            />
                            <label htmlFor={`avail-${order.orderId}-${item.id}`} className="availability-label">Available</label>
                            <input 
                                type="text" 
                                placeholder="Add price/notes..." 
                                className="feedback-input" 
                                style={{width: 'calc(100% - 110px)', display: 'inline-block'}} // Adjusted width
                                value={onFeedbackChange.getFeedback(order.orderId, item.id)?.notes ?? ''}
                                onChange={(e) => onFeedbackChange.setFeedback(order.orderId, item.id, 'notes', e.target.value)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
            {/* Row for Total Price and Submit button */}
             <tr style={{borderTop: '1px solid var(--border-color)'}}>
                 <td colSpan="3" style={{padding: '1rem'}}>
                    <label style={{fontWeight: '500', color: 'var(--text-dark)', marginRight: '0.5rem'}}>Total Price:</label>
                    <input 
                        type="text" 
                        placeholder="Enter total price..." 
                        className="feedback-input" 
                        style={{width: '200px', display: 'inline-block', marginTop: 0}}
                        value={onFeedbackChange.getOrderTotalPrice(order.orderId)}
                        onChange={(e) => onFeedbackChange.setOrderTotalPrice(order.orderId, e.target.value)}
                    />
                 </td>
                 <td colSpan="2" style={{textAlign: 'right', padding: '1rem'}}>
                    <button onClick={() => onSubmitFeedback(order.orderId)} className="btn btn-purple">
                        <SendIcon /> Send Status to Admin
                    </button>
                 </td>
             </tr>
        </tbody>
    );
};


const IncomingOrdersPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [feedback, setFeedback] = React.useState({}); // State to hold feedback

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
                    ...(prev[orderId]?.[itemId] ?? { available: true }), // Default available=true
                    [key]: value
                }
            }
        }));
    };

    const setOrderTotalPrice = (orderId, totalPrice) => {
        setFeedback(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                totalPrice: totalPrice
            }
        }));
    };

    const getOrderTotalPrice = (orderId) => {
        return feedback[orderId]?.totalPrice ?? '';
    };
    // --------------------------------

    // Placeholder action
    const handleSubmitFeedback = (orderId) => {
        const orderFeedback = feedback[orderId] || {};
        // Add default availability if vendor didn't touch the checkbox
        const order = orders.find(o => o.orderId === orderId);
        const completeFeedback = order.items.map(item => ({
            itemId: item.id,
            available: orderFeedback[item.id]?.available ?? true, // Default to true if not set
            notes: orderFeedback[item.id]?.notes ?? ''
        }));

        const totalPrice = orderFeedback.totalPrice ?? '';

        console.log("Submitting feedback for Order:", orderId, {
            items: completeFeedback,
            totalPrice: totalPrice
        }); 
        alert(`Sending status to Admin for Order ${orderId}\nTotal Price: ${totalPrice || 'Not provided'}`);
        // TODO: Send 'completeFeedback' array and 'totalPrice' to backend API
        // On success, maybe remove the order from this list or refetch
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
                ) : orders.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead className="table-header">
                                <tr>
                                    <th>Item</th>
                                    <th>Total Qty</th>
                                    <th>Kitchen Breakdown</th>
                                    <th>Status</th> {/* Keep status column for context */}
                                    <th>Feedback (Availability/Notes)</th> {/* Changed Header */}
                                </tr>
                            </thead>
                            {/* Render each order using the OrderFeedbackRow component */}
                            {orders.map((order) => (
                                <OrderFeedbackRow 
                                    key={order.orderId} 
                                    order={order} 
                                    onFeedbackChange={{ 
                                        getFeedback, 
                                        setFeedback: setFeedbackItem,
                                        getOrderTotalPrice,
                                        setOrderTotalPrice
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
    // ... (This component remains the same as before)
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        // TODO: Add real API call: vendorAPI.getSupplyHistory()
        const timer = setTimeout(() => {
            setOrders(MOCK_SUPPLY_HISTORY);
            setLoading(false);
        }, 500); 
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Supply History</h3>
                <p className="page-description">Record of all orders marked as supplied.</p>
            </div>
             <div className="card">
                 <div className="history-header">
                     <h4 className="page-title" style={{fontSize: '1.25rem'}}>Completed Supplies</h4>
                     <div className="history-filter">
                         <label htmlFor="date-filter" className="form-label" style={{marginBottom: 0}}>Filter by Date:</label>
                         <input type="date" id="date-filter" className="form-input"/>
                     </div>
                 </div>
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>Order ID</th>
                                <th>Date Supplied</th>
                                <th>Total Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {loading ? (
                                <tr className="table-empty-row">
                                    <td colSpan="4">Loading history...</td>
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