import React from 'react';
import { useAuth } from '../context/AuthContext';

// --- MOCK DATA --- //
const AVAILABLE_ITEMS = [
  // ... (items list is unchanged)
  "Onion", "Tomato", "Potato", "Carrot", "Garlic", "Ginger", "Green Chilli", "Bell Pepper (Capsicum)", "Cabbage", "Cauliflower", "Spinach", "Lady's Finger (Okra)", "Brinjal (Eggplant)", "Cucumber", "Lemon", "Coriander Leaves", "Mint Leaves", "Curry Leaves",
  "Basmati Rice", "Sona Masoori Rice", "Idli Rice", "Whole Wheat Flour (Atta)", "All-Purpose Flour (Maida)", "Semolina (Rava/Sooji)", "Toor Dal (Arhar)", "Moong Dal", "Chana Dal", "Urad Dal", "Masoor Dal", "Chickpeas (Kabuli Chana)",
  "Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Powder", "Garam Masala", "Mustard Seeds", "Cumin Seeds", "Fenugreek Seeds", "Asafoetida (Hing)", "Black Pepper", "Cardamom", "Cloves", "Cinnamon", "Salt",
  "Milk", "Yogurt (Curd)", "Paneer", "Ghee", "Butter",
  "Sunflower Oil", "Groundnut Oil", "Mustard Oil", "Coconut Oil",
  "Sugar", "Jaggery", "Poha (Flattened Rice)", "Tamarind", "Vinegar"
];



// --- STYLES COMPONENT (Simplified) --- //
const DashboardStyles = () => (
  <style>{`
   :root {
  --primary-blue: #5b21b6;
  --primary-blue-dark: #588157;
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
    .header-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .header-subtitle span {
      font-weight: 500;
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

    /* --- Forms & Inputs --- */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      align-items: flex-end;
    }
    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(5, 1fr);
      }
      .form-grid-col-2 {
        grid-column: span 2 / span 2;
      }
    }
    
    .form-group {
      position: relative;
    }
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-light);
      margin-bottom: 0.25rem;
    }
    .form-input, .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      background-color: var(--white);
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-sizing: border-box; /* Important */
    }
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
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
      height: 38px; /* Match input height */
    }
    .btn:hover {
      background-color: var(--primary-blue-dark);
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
    .btn-manual {
      font-size: 0.875rem;
      color: var(--primary-blue);
      margin-top: 0.5rem;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .btn-manual:hover {
      text-decoration: underline;
    }
    .manual-entry-text {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    /* Search Dropdown */
    .search-results {
      position: absolute;
      z-index: 10;
      width: 100%;
      background-color: var(--white);
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      margin-top: 0.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      max-height: 12rem;
      overflow-y: auto;
    }
    .search-result-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .search-result-item:hover {
      background-color: #ebf8ff;
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
    .table-cell-action {
      text-align: right;
    }
    .btn-remove {
      color: var(--red);
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
    }
    .btn-remove:hover {
      color: var(--red-dark);
      text-decoration: underline;
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
    
    /* All status badge CSS is removed */
    
  `}</style>
);


// --- SVG ICONS --- //
const CreateOrderIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z"></path></svg>
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
                <p className="sidebar-subtitle">Chef Portal</p>
            </div>
            <nav className="sidebar-nav">
                <a onClick={() => setActivePage('create-order')} className={linkClasses('create-order')}>
                    <CreateOrderIcon /> Create Order
                </a>
                <a onClick={() => setActivePage('order-history')} className={linkClasses('order-history')}>
                    <HistoryIcon /> Order History
                </a>
            </nav>
        </aside>
    );
};

const Header = ({ kitchen, onLogout }) => (
    <header className="header">
        <div>
            <h2 className="header-title">Welcome Chef!</h2>
            <p className="header-subtitle">Kitchen: <span>{kitchen || 'Loading...'}</span></p>
        </div>
        <button className="btn-logout" onClick={onLogout}>
            <LogoutIcon /> Logout
        </button>
    </header>
);

const CreateOrderPage = () => {
    // ... (This component is unchanged)
    const [orderItems, setOrderItems] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] =React.useState('');
    const [unit, setUnit] = React.useState('kg');
    const [isManualEntry, setIsManualEntry] = React.useState(false);
    const [itemInputValue, setItemInputValue] = React.useState('');

    const filteredItems = searchQuery 
        ? AVAILABLE_ITEMS.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const handleAddItem = () => {
        if (itemName && quantity) {
            const newItem = { name: itemName, quantity, unit };
            setOrderItems([...orderItems, newItem]);
            // Reset fields
            setItemName('');
            setQuantity('');
            setUnit('kg');
            setSearchQuery('');
            setIsManualEntry(false);
            setItemInputValue('');
        }
    };

    const handleSelectItem = (item) => {
        setItemName(item);
        setItemInputValue(item);
        setSearchQuery('');
        setIsManualEntry(false);
    };

    const handleRemoveItem = (indexToRemove) => {
        setOrderItems(orderItems.filter((_, index) => index !== indexToRemove));
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        setItemInputValue(value);

        if(isManualEntry){
            setItemName(value);
        } else {
            setSearchQuery(value);
            setItemName(value);
        }
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Create Daily Order</h3>
                <p className="page-description">Search for an item or add one manually to build your order list.</p>
            </div>

            {/* Item Input Section */}
            <div className="card">
                <div className="form-grid">
                    <div className="form-group form-grid-col-2">
                        <label htmlFor="item-search" className="form-label">Search Item</label>
                        <input 
                            type="text" 
                            id="item-search"
                            placeholder="e.g., Onion"
                            className="form-input"
                            value={itemInputValue}
                            onChange={handleInputChange}
                        />
                        {searchQuery && filteredItems.length > 0 && (
                            <div className="search-results">
                                {filteredItems.map(item => (
                                    <div 
                                        key={item}
                                        className="search-result-item"
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                         {!isManualEntry && (
                            <button onClick={() => { setIsManualEntry(true); setSearchQuery(''); setItemInputValue(''); setItemName(''); }} 
                                    className="btn-manual">
                                Can't find it? Add manually.
                            </button>
                        )}
                        {isManualEntry && <p className="manual-entry-text"><button onClick={() => {setIsManualEntry(false); setItemInputValue('');}} className="btn-manual">Cancel</button></p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="item-quantity" className="form-label">Quantity</label>
                        <input 
                            type="number" 
                            id="item-quantity" 
                            placeholder="e.g., 20" 
                            className="form-input"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-unit" className="form-label">Unit</label>
                        <select 
                            id="item-unit" 
                            className="form-select"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option>kg</option>
                            <option>liters</option>
                            <option>pieces</option>
                            <option>grams</option>
                            <option>packet</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button onClick={handleAddItem} className="btn">
                            Add Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Order List Table */}
            <div className="card">
                <h4 className="page-title" style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Today's Order List ({orderItems.length} items)</h4>
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th className="table-cell-action">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {orderItems.length > 0 ? (
                                orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="table-cell-name">{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                        <td className="table-cell-action">
                                            <button onClick={() => handleRemoveItem(index)} className="btn-remove">Remove</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row">
                                    <td colSpan="5">Your order list is empty. Add items above to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {orderItems.length > 0 && (
                     <div className="table-footer">
                        <button className="btn btn-green">
                            Submit Final Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- UPDATED OrderHistoryPage (Simplified Receipt) --- //
const OrderHistoryPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        setLoading(true);
        // Simulating an API call to fetch order history
        const timer = setTimeout(() => {
            setOrders(MOCK_ORDERS);
            setLoading(false);
        }, 1000); // 1 second delay
        
        return () => clearTimeout(timer); // Cleanup
    }, []);

    // Helper function to show a summary of items
    const getItemSummary = (items) => {
        if (!items || items.length === 0) return 'No items';
        
        const firstTwo = items.slice(0, 2).map(item => item.name).join(', ');
        
        if (items.length > 2) {
            return `${firstTwo} + ${items.length - 2} more`;
        }
        return firstTwo;
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Order History</h3>
                <p className="page-description">A record of your submitted orders for the current month.</p>
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
                                <th>Date</th>
                                <th>Items Ordered</th>
                                <th>Total Items</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {loading ? (
                                <tr className="table-empty-row">
                                    <td colSpan="3">Loading history...</td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="table-cell-name">{order.date}</td>
                                        <td>{getItemSummary(order.items)}</td>
                                        <td>{order.items.length} items</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row">
                                    <td colSpan="3">No past orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component --- //

export default function App() {
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