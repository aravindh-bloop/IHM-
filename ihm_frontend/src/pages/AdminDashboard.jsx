import React from 'react';
import { useAuth } from '../context/AuthContext';

// --- MOCK DATA REMOVED --- //
// const MOCK_PENDING_ORDER = { ... };
// const MOCK_HISTORY_ORDERS = [ ... ];


// --- STYLES COMPONENT (Includes all statuses for Admin) --- //
const DashboardStyles = () => (
  <style>{`
    :root {
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
      min-width: 600px;
    }
    .table-header {
      background-color: #f9fafb;
    }
    .table th {
      padding: 0.75rem 1.5rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .table td {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.875rem;
    }
    .table-empty-row td {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }
    .table-body tr:first-child td {
      border-top: none;
    }
    .table-body {
      background-color: var(--white);
    }
    .table-cell-name {
      font-weight: 500;
      color: var(--text-dark);
    }
    
    /* Admin-specific styles */
    .item-breakdown {
        font-size: 0.8rem;
        color: var(--text-light);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .item-breakdown span {
        font-weight: 500;
    }
    
    .btn {
      width: 100%;
      background-color: var(--primary-blue);
      color: var(--white);
      font-weight: 700;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
    }
    .btn-green {
      background-color: var(--green);
      font-size: 1.125rem;
      padding: 0.75rem 2rem;
      height: auto;
    }
    .btn-green:hover {
      background-color: var(--green-dark);
    }
    
    .table-footer {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
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
    
    /* --- Statuses for Admin History --- */
    .status-badge {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: capitalize;
    }
    .status-sent-to-admin { /* This is "Pending" for the admin */
      background-color: #fef9c3; /* Yellow */
      color: #854d0e;
    }
    .status-verified {
      background-color: #dbeafe; /* Blue */
      color: #1e40af;
    }
    .status-confirmed {
      background-color: #ccefed; /* Cyan */
      color: #0e7490;
    }
    .status-supplied {
      background-color: #dcfce7; /* Green */
      color: #166534;
    }
    
  `}</style>
);


// --- SVG ICONS --- //
const ClipboardListIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
);
const HistoryIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const LogoutIcon = () => (
   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

// --- Sub-Components --- //

const Sidebar = ({ activePage, setActivePage }) => {
    const linkClasses = (page) => 
        `sidebar-link ${activePage === page ? 'active' : ''}`;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">FUMU</h1>
                <p className="sidebar-subtitle">Admin Portal</p>
            </div>
            <nav className="sidebar-nav">
                <a onClick={() => setActivePage('pending')} className={linkClasses('pending')}>
                    <ClipboardListIcon /> Pending Orders
                </a>
                <a onClick={() => setActivePage('history')} className={linkClasses('history')}>
                    <HistoryIcon /> Order History
                </a>
            </nav>
        </aside>
    );
};

const Header = ({ onLogout }) => (
    <header className="header">
        <div>
            <h2 className="header-title">Welcome, Admin!</h2>
        </div>
        <button className="btn-logout" onClick={onLogout}>
            <LogoutIcon /> Logout
        </button>
    </header>
);

const PendingOrdersPage = () => {
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // TODO: Add real API call here
        // e.g., adminAPI.getPendingOrder().then(data => setOrder(data));
        const timer = setTimeout(() => {
            // setOrder(MOCK_PENDING_ORDER); // Dummy data removed
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Helper to format the kitchen breakdown
    const renderBreakdown = (breakdown) => {
        return Object.entries(breakdown).map(([kitchen, qty]) => (
            <div key={kitchen}>
                <span>{kitchen}:</span> {qty}
            </div>
        ));
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Pending Merged Order</h3>
                <p className="page-description">Review the automatically merged order from all kitchens before verifying.</p>
            </div>
            
            <div className="card">
                {loading ? (
                    <div className="table-empty-row" style={{border: 'none'}}>Loading pending order...</div>
                ) : order ? (
                    <>
                        <h4 className="page-title" style={{fontSize: '1.25rem', marginBottom: '1rem'}}>
                            Order for: {order.date}
                        </h4>
                        <div className="table-container">
                            <table className="table">
                                <thead className="table-header">
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Total Quantity</th>
                                        <th>Kitchen Breakdown</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {order.items.map((item) => (
                                        <tr key={item.name}>
                                            <td className="table-cell-name">{item.name}</td>
                                            <td>{item.totalQuantity} {item.unit}</td>
                                            <td className="item-breakdown">
                                                {renderBreakdown(item.breakdown)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-footer">
                            <button className="btn btn-green">
                                Verify Order & Send to Vendor
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="table-empty-row" style={{border: 'none', paddingTop: '2rem', paddingBottom: '2rem'}}>
                        No pending orders found for today.
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        // TODO: Add real API call here
        // e.g., adminAPI.getOrderHistory().then(data => setOrders(data));
        const timer = setTimeout(() => {
            // setOrders(MOCK_HISTORY_ORDERS); // Dummy data removed
            setLoading(false);
        }, 500); 
        
        return () => clearTimeout(timer);
    }, []);

    // StatusBadge component for the Admin
    const StatusBadge = ({ status }) => {
        // Converts "Sent to Admin" to "sent-to-admin"
        const statusClass = status.toLowerCase().replace(/ /g, '-'); 
        return <span className={`status-badge status-${statusClass || 'verified'}`}>{status}</span>;
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Verified Order History</h3>
                <p className="page-description">Track the status of all past orders sent to vendors.</p>
            </div>
             <div className="card">
                 <div className="history-header">
                     <h4 className="page-title" style={{fontSize: '1.25rem'}}>All Past Orders</h4>
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
                                    <td colSpan="4">No past orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- Main AdminDashboard Component --- //

export default function AdminDashboard() {
    const [activePage, setActivePage] = React.useState('pending'); // Default to pending orders
    const { logout } = useAuth(); // Get logout function from context

    const renderPage = () => {
        switch (activePage) {
            case 'pending':
                return <PendingOrdersPage />;
            case 'history':
                return <OrderHistoryPage />;
            default:
                return <PendingOrdersPage />;
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