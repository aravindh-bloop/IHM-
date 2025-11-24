import React from 'react';
import { useAuth } from '../context/AuthContext';
import { vendorAPI } from '../services/api';

// --- STYLES COMPONENT --- //
const DashboardStyles = () => (
  <style>{`
    :root {
      --primary-blue: #5b21b6;
      --primary-blue-dark: #3b0764;
      --bg-gray: #e9d5ff;
      --text-dark: #1e1b4b;
      --text-light: #6d28d9;
      --text-muted: #7c7aa9;
      --border-color: #9f8bf5;
      --white: #f5e1ff;
      --red: #dc2626;
      --red-dark: #991b1b;
      --green: #22c55e;
      --green-dark: #15803d;
      --shadow: 0 8px 16px rgba(93, 51, 177, 0.2);
      --font-family: 'Poppins', 'Inter', 'Segoe UI', Roboto, sans-serif;
      --purple: var(--primary-blue);
      --purple-dark: var(--primary-blue-dark);
    }
    
    body { font-family: var(--font-family); margin: 0; }
    .dashboard-container { display: flex; height: 100vh; overflow: hidden; background-color: var(--bg-gray); }

    /* Sidebar */
    .sidebar { width: 256px; background-color: var(--white); box-shadow: var(--shadow); display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
    .sidebar-title { font-size: 1.875rem; font-weight: 700; color: var(--primary-blue); letter-spacing: 0.05em; }
    .sidebar-subtitle { font-size: 0.875rem; color: var(--text-muted); }
    .sidebar-nav { flex-grow: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-link { display: flex; align-items: center; padding: 0.75rem 1rem; color: var(--text-dark); border-radius: 0.5rem; transition: all 0.2s ease-in-out; cursor: pointer; text-decoration: none; }
    .sidebar-link:hover { background-color: #f3f4f6; }
    .sidebar-link.active { background-color: var(--primary-blue); color: var(--white); }
    .sidebar-link svg { width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; }

    /* Main Content */
    .main-content { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
    .header { background-color: var(--white); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
    .header-title { font-size: 1.25rem; font-weight: 600; color: var(--text-dark); }
    .btn-logout { background-color: var(--red); color: var(--white); font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; display: flex; align-items: center; border: none; cursor: pointer; }
    .btn-logout:hover { background-color: var(--red-dark); }
    .btn-logout svg { width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; }

    .page-content { padding: 2rem; flex-grow: 1; overflow-y: auto; }
    .page-section { display: flex; flex-direction: column; gap: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; color: var(--text-dark); }
    .page-description { color: var(--text-muted); }
    .card { background-color: var(--white); padding: 1.5rem; border-radius: 0.75rem; box-shadow: var(--shadow); }

    /* Table */
    .table-container { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; min-width: 800px; }
    .table-header { background-color: #f9fafb; }
    .table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .table td { padding: 1rem 1rem; border-top: 1px solid var(--border-color); font-size: 0.875rem; vertical-align: top; }
    .table-empty-row td { text-align: center; padding: 2rem; color: var(--text-muted); }
    .table-body { background-color: var(--white); }
    .table-cell-name { font-weight: 500; color: var(--text-dark); white-space: nowrap; }
    
    /* Vendor-specific */
    .item-breakdown { font-size: 0.8rem; color: var(--text-light); max-width: 250px; white-space: normal; }
    .item-breakdown span { font-weight: 500; }
    .feedback-input { width: 100%; padding: 0.3rem 0.5rem; border: 1px solid var(--border-color); border-radius: 0.25rem; font-size: 0.8rem; margin-top: 0.25rem; }

    .btn { background-color: var(--primary-blue); color: var(--white); font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 5px; }
    .btn:hover { opacity: 0.9; }
    .btn-purple { background-color: var(--purple); }
    .btn-purple:hover { background-color: var(--purple-dark); }
    .btn-view { background-color: var(--primary-blue); font-size: 0.75rem; padding: 0.4rem 0.8rem; }
    
    /* Status Badges */
    .status-badge { padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; text-transform: capitalize; white-space: nowrap; }
    .status-pending { background-color: #dbeafe; color: #1e40af; }
    .status-completed { background-color: #dcfce7; color: #166534; }
    .status-cancelled { background-color: #fee2e2; color: #991b1b; }
    
    /* 🎨 CHANGE 10: Improved dropdown styling for vendor */
    .form-select {
      background: linear-gradient(135deg, rgba(91, 33, 182, 0.05), rgba(139, 92, 246, 0.1));
      border: 2px solid var(--border-color);
      font-weight: 500;
      color: var(--text-dark);
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
    }
    .form-select:hover {
      border-color: var(--primary-blue);
      background: linear-gradient(135deg, rgba(91, 33, 182, 0.1), rgba(139, 92, 246, 0.15));
    }

    /* Modal for viewing order details */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background-color: var(--white); padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; }
    .modal-title { font-size: 1.5rem; font-weight: 600; color: var(--text-dark); margin-bottom: 1rem; }
    .modal-close { background-color: var(--primary-blue); color: var(--white); padding: 0.5rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; margin-top: 1.5rem; }
    .modal-close:hover { background-color: var(--primary-blue-dark); }
    
    .order-details-list { list-style: none; padding: 0; margin: 0; }
    .order-details-item { padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; }
    .order-details-item:last-child { border-bottom: none; }
  `}</style>
);


// --- SVG ICONS --- //
const InboxInIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H17"></path></svg> );
const HistoryIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> );
const LogoutIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> );
const SendIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> );

// --- Sub-Components --- //

const Sidebar = ({ activePage, setActivePage }) => {
    const linkClasses = (page) => `sidebar-link ${activePage === page ? 'active' : ''}`;

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
        <div><h2 className="header-title">Welcome, Vendor!</h2></div>
        <button className="btn-logout" onClick={onLogout}>
            <LogoutIcon /> Logout
        </button>
    </header>
);

const StatusBadge = ({ status }) => {
    const statusClass = status.toLowerCase().replace(/ /g, '-'); 
    return <span className={`status-badge status-${statusClass || 'verified'}`}>{status}</span>;
};

// Order Details Modal Component
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Order #{order.id} - Details</h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>
                    Date: {order.date} | Status: <StatusBadge status={order.status} />
                </p>
                
                <h4 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-dark)'}}>
                    Items Included:
                </h4>
                <ul className="order-details-list">
                    {order.items && order.items.map((item, index) => (
                        <li key={index} className="order-details-item">
                            <span className="table-cell-name">{item.name}</span>
                            <span style={{color: 'var(--text-light)', fontWeight: 500}}>
                                {item.deliveredQty || item.quantity} {item.unit}
                            </span>
                        </li>
                    ))}
                </ul>
                
                <div style={{marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem'}}>
                    <strong>Total Items:</strong> {order.items ? order.items.length : order.itemCount}
                </div>
                
                <button className="modal-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

const OrderFeedbackRow = ({ order, onFeedbackChange, onSubmitFeedback }) => {
    return (
         <tbody className="table-body">
            <tr style={{backgroundColor: '#f9fafb', borderTop: '2px solid var(--border-color)'}}>
                 <td colSpan="2">
                    <span className="table-cell-name">Order ID: {order.orderId}</span> ({order.date})
                 </td>
                 <td><StatusBadge status={order.status} /></td>
                 <td colSpan="2"></td>
            </tr>
            {order.items.map((item) => (
                <tr key={item.id}>
                    <td className="table-cell-name">{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td></td>
                    <td colSpan="2">
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <label style={{fontWeight: '500', whiteSpace: 'nowrap'}}>Delivered:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={item.quantity}
                                    placeholder="Qty"
                                    className="feedback-input"
                                    style={{width: '100px', marginTop: 0}}
                                    value={onFeedbackChange.getFeedback(order.orderId, item.id)?.deliveredQty ?? item.quantity}
                                    onChange={(e) => onFeedbackChange.setFeedback(order.orderId, item.id, 'deliveredQty', parseInt(e.target.value) || 0)}
                                />
                                <span style={{color: 'var(--text-muted)'}}>{item.unit}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <label style={{fontWeight: '500', whiteSpace: 'nowrap'}}>Unit Price:</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="₹"
                                    className="feedback-input"
                                    style={{width: '100px', marginTop: 0}}
                                    value={onFeedbackChange.getFeedback(order.orderId, item.id)?.unitPrice ?? ''}
                                    onChange={(e) => onFeedbackChange.setFeedback(order.orderId, item.id, 'unitPrice', parseFloat(e.target.value) || null)}
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            ))}
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
    const [feedback, setFeedback] = React.useState({});

    React.useEffect(() => {
        fetchIncomingOrders();
    }, []);

    const fetchIncomingOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vendorAPI.getIncomingOrders();
            const transformedOrders = response.map(order => ({
                orderId: order.order_id,
                date: new Date(order.date).toLocaleDateString(),
                status: order.status,
                totalItems: order.total_items,
                items: order.items.map(item => ({
                    id: item.item_id,
                    name: item.item_name,
                    quantity: item.total_quantity,
                    unit: item.unit || 'kg',

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

    const handleSubmitFeedback = async (orderId) => {
        try {
            const orderFeedback = feedback[orderId] || {};
            const order = orders.find(o => o.orderId === orderId);
            
            const items = order.items.map(item => ({
                item_id: item.id,
                delivered_quantity: orderFeedback[item.id]?.deliveredQty ?? item.quantity,
                unit_price: orderFeedback[item.id]?.unitPrice ?? null
            }));

            await vendorAPI.updateOrderStatus(orderId, {
                items: items,
                mark_as_completed: true
            });

            alert(`Status sent to Admin successfully for Order ${orderId}`);
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
                                    <th colSpan="2">Delivered Quantity & Price</th>
                                </tr>
                            </thead>
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

    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [orderDetails, setOrderDetails] = React.useState(null);
    const [loadingDetails, setLoadingDetails] = React.useState(false);

    React.useEffect(() => {
        fetchSupplyHistory();
    }, []);

    const fetchSupplyHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vendorAPI.getSupplyHistory();
            console.log("API Response:", response);

            const transformedHistory = response.map(order => ({
                id: order.order_id,
                date: new Date(order.date).toLocaleDateString(),
                totalItems: order.total_items,
                status: order.status,
                totalPrice: order.total_price,
                items: order.items || []
            }));
            setOrders(transformedHistory);
        } catch (err) {
            console.error('Error fetching supply history:', err);
            setError('Failed to load supply history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // 🔄 CHANGE 9: Fetch and show completed order details
    const handleViewDetails = async (orderId) => {
        try {
            setLoadingDetails(true);
            // TODO: Replace with actual API call
            // const response = await vendorAPI.getOrderDetails(orderId);
            
            // Mock data for demonstration
            const mockDetails = {
                id: orderId,
                date: orders.find(o => o.id === orderId)?.date,
                status: orders.find(o => o.id === orderId)?.status,
                items: [
                    { name: 'Onion', quantity: 50, unit: 'kg', deliveredQty: 50 },
                    { name: 'Tomato', quantity: 30, unit: 'kg', deliveredQty: 28 },
                    { name: 'Potato', quantity: 40, unit: 'kg', deliveredQty: 40 }
                ]
            };
            
            setOrderDetails(mockDetails);
            setSelectedOrder(orderId);
        } catch (err) {
            console.error('Error fetching order details:', err);
            alert('Failed to load order details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'var(--green-dark)';
            case 'cancelled': return 'var(--red-dark)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Supply History</h3>
                <p className="page-description">Record of all completed and cancelled orders.</p>
            </div>

            {error && (
                <div style={{
                    color: 'var(--red-dark)',
                    backgroundColor: '#fee2e2',
                    border: '1px solid var(--red)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    {error}
                    <button onClick={fetchSupplyHistory} className="btn" style={{marginTop: '1rem'}}>
                        Retry
                    </button>
                </div>
            )}

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Items</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Item Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {loading ? (
                                <tr className="table-empty-row">
                                    <td colSpan="7">Loading history...</td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="table-cell-name">{order.id.substring(0, 8).toUpperCase()}</td>
                                        <td>{order.date}</td>
                                        <td>{order.totalItems}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '0.375rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize',
                                                backgroundColor: order.status === 'completed' ? '#dcfce7' : '#fee2e2',
                                                color: getStatusColor(order.status)
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: order.totalPrice ? 'var(--green-dark)' : 'var(--text-muted)' }}>
                                            {order.totalPrice ? `₹${order.totalPrice.toFixed(2)}` : 'N/A'}
                                        </td>
                                        <td>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85em', padding: '0.2em 0' }}>
                                                    <strong>{item.item_name}:</strong> {item.total_quantity} {item.unit || 'kg'}
                                                    {item.delivered_quantity && ` (Delivered: ${item.delivered_quantity} ${item.unit || 'kg'})`}
                                                    {item.unit_price && ` @ ₹${item.unit_price}/${item.unit || 'unit'}`}
                                                    {item.total_price && ` = ₹${item.total_price.toFixed(2)}`}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {/* 🔄 CHANGE 9: Button to view what was included */}
                                            <button 
                                                className="btn btn-view"
                                                onClick={() => handleViewDetails(order.id)}
                                                disabled={loadingDetails}
                                            >
                                                {loadingDetails && selectedOrder === order.id ? 'Loading...' : 'View Details'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row">
                                    <td colSpan="7">No supply history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal 
                isOpen={!!orderDetails}
                onClose={() => { setOrderDetails(null); setSelectedOrder(null); }}
                order={orderDetails}
            />
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