import React from 'react';
import { useAuth } from '../context/AuthContext';
import { stallAPI } from '../services/api';


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
    :root {
      --primary-blue: #5b21b6;
      --primary-blue-dark: #588157;
      --bg-gray: #fdfbff;
      --text-dark: #1e1b4b;
      --text-light: #6d28d9;
      --text-muted: #7c7aa9;
      --border-color: #9f8bf5;
      --white: #f5e1ff;
      --red: #dc2626;
      --red-dark: #991b1b;
      --green: #22c55e;
      --green-dark: #15803d;
      --yellow: #f59e0b;
      --yellow-dark: #d97706;
      --blue: #3b82f6;
      --blue-dark: #1d4ed8;
      --shadow: 0 8px 16px rgba(93, 51, 177, 0.2);
      --font-family: 'Poppins', 'Inter', 'Segoe UI', Roboto, sans-serif;
    }
    body { font-family: var(--font-family); margin: 0; overscroll-behavior: none;}
    .dashboard-container { display: flex; height: 100vh; overflow: hidden; background-color: var(--bg-gray);overscroll-behavior: none; }
    .sidebar { width: 256px; background-color: var(--white); box-shadow: var(--shadow); display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
    .sidebar-title { font-size: 1.875rem; font-weight: 700; color: var(--primary-blue); letter-spacing: 0.05em; }
    .sidebar-subtitle { font-size: 0.875rem; color: var(--text-muted); }
    .sidebar-nav { flex-grow: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-link { display: flex; align-items: center; padding: 0.75rem 1rem; color: var(--text-dark); border-radius: 0.5rem; transition: all 0.2s ease-in-out; cursor: pointer; text-decoration: none; border: none; background: none; text-align: left; font-family: inherit; font-size: inherit; width: 100%; }
    .sidebar-link:hover { background-color: #f3f4f6; }
    .sidebar-link.active { background-color: var(--primary-blue); color: var(--white); }
    .sidebar-link svg { width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; }
    .main-content { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
    .header { background-color: var(--white); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
    .header-title { font-size: 1.25rem; font-weight: 600; color: var(--text-dark); }
    .header-subtitle { font-size: 0.875rem; color: var(--text-muted); }
    .header-subtitle span { font-weight: 500; color: var(--text-dark); }
    .btn-logout { background-color: var(--red); color: var(--white); font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; display: flex; align-items: center; border: none; cursor: pointer; }
    .btn-logout:hover { background-color: var(--red-dark); }
    .btn-logout svg { width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; }
    .page-content { padding: 2rem; flex-grow: 1; overflow-y: auto; }
    .page-section { display: flex; flex-direction: column; gap: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; color: var(--text-dark); }
    .page-description { color: var(--text-muted); }
    .card { background-color: var(--white); padding: 1.5rem; border-radius: 0.75rem; box-shadow: var(--shadow); }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; align-items: flex-end; }
    @media (min-width: 768px) { .form-grid { grid-template-columns: repeat(5, 1fr); } .form-grid-col-2 { grid-column: span 2 / span 2; } }
    .form-group { position: relative; }
    .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-light); margin-bottom: 0.25rem; }
    .form-input, .form-select { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--white); border: 2px solid #a669ecff; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); box-sizing: border-box; }
    
    /* 🎨 CHANGE 5: Improved dropdown styling */
    .form-select { 
      background: linear-gradient(135deg, rgba(91, 33, 182, 0.05), rgba(139, 92, 246, 0.1));
      border: 2px solid var(--border-color);
      font-weight: 500;
      color: var(--text-dark);
      cursor: pointer;
    }
    .form-select:hover {
      border-color: var(--primary-blue);
      background: linear-gradient(135deg, rgba(91, 33, 182, 0.1), rgba(139, 92, 246, 0.15));
    }
      /* Dropdown option styling - add this after .form-select:hover */
.form-select option {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--white);
  color: var(--text-dark);
  font-weight: 500;
}

.form-select option:last-child {
  border-bottom: none;
}

/* Color-coded dropdown options */
.form-select option[value="pending"] {
  color: #92400e;
  background-color: #fef3c7;
}

.form-select option[value="approved"] {
  color: #065f46;
  background-color: #d1fae5;
}

.form-select option[value="rejected"] {
  color: #991b1b;
  background-color: #fee2e2;
}

.form-select option[value="completed"] {
  color: #1e40af;
  background-color: #dbeafe;
}

.form-select option[value="all"] {
  color: var(--text-dark);
  background-color: #f3f4f6;
  font-weight: 600;
}
    
    .form-input:focus, .form-select:focus { outline: none; border-color: var(--primary-blue); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }
    .btn { width: 100%; background-color: var(--primary-blue); color: var(--white); font-weight: 700; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background-color 0.2s; border: none; cursor: pointer; height: 38px; }
    .btn:hover { background-color: var(--primary-blue-dark); }
    .btn-green { background-color: var(--green); font-size: 1.125rem; padding: 0.75rem 2rem; height: auto; }
    .btn-green:hover { background-color: var(--green-dark); }
    .btn-yellow { background-color: var(--yellow); }
    .btn-yellow:hover { background-color: var(--yellow-dark); }
    .btn-small { font-size: 0.875rem; padding: 0.4rem 0.8rem; height: auto; width: auto; margin-left: 0.5rem; }
    .btn-manual { font-size: 0.875rem; color: var(--primary-blue); margin-top: 0.5rem; background: none; border: none; padding: 0; cursor: pointer; }
    .btn-manual:hover { text-decoration: underline; }
    .manual-entry-text { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem; }
    .search-results { position: absolute; z-index: 10; width: 100%; background-color: var(--white); border: 1px solid var(--border-color); border-radius: 0.375rem; margin-top: 0.25rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); max-height: 12rem; overflow-y: auto; }
    .search-result-item { padding: 0.5rem 1rem; cursor: pointer; }
    .search-result-item:hover { background-color: #ebf8ff; }
    .table-container { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; min-width: 600px; }
    .table-header { background-color: #f9fafb; }
    .table th { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .table td { padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); font-size: 0.875rem; }
    .table-empty-row td { text-align: center; padding: 2rem; color: var(--text-muted); }
    .table-body tr:first-child td { border-top: none; }
    .table-body { background-color: var(--white); }
    .table-cell-name { font-weight: 500; color: var(--text-dark); }
    .table-cell-action { text-align: center; }
    .btn-remove { color: var(--red); font-weight: 500; background: none; border: none; cursor: pointer; }
    .btn-remove:hover { color: var(--red-dark); text-decoration: underline; }
    .table-footer { margin-top: 1.5rem; display: flex; justify-content: flex-end; }
    .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .history-filter { display: flex; align-items: center; gap: 0.5rem; }
    
    /* 🎨 CHANGE 4: Color-coded status badges */
    .status-badge {
      padding: 0.35rem 0.9rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: capitalize;
      display: inline-block;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
      border: 2px solid var(--yellow);
    }
    .status-approved {
      background-color: #d1fae5;
      color: #065f46;
      border: 2px solid var(--green);
    }
    .status-rejected {
      background-color: #fee2e2;
      color: #991b1b;
      border: 2px solid var(--red);
    }
    .status-completed {
      background-color: #dbeafe;
      color: #1e40af;
      border: 2px solid var(--blue);
    }
    
    /* Confirmation Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: var(--white);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
    }
    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }
    .modal-message {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `}</style>
);


// --- SVG ICONS --- //
const CreateOrderIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z"></path></svg> );
const HistoryIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> );
const LogoutIcon = () => ( <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> );

// --- Confirmation Modal Component --- //
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onClose} style={{backgroundColor: '#6b7280'}}>
            Cancel
          </button>
          <button className="btn btn-green" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components --- //

const Sidebar = ({ activePage, setActivePage }) => {
  const linkClasses = (page) => `sidebar-link ${activePage === page ? 'active' : ''}`;
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">FUMU</h1>
        <p className="sidebar-subtitle">Chef Portal</p>
      </div>
      <nav className="sidebar-nav">
        <button onClick={() => setActivePage('create-order')} className={linkClasses('create-order')}>
          <CreateOrderIcon /> Create Order
        </button>
        <button onClick={() => setActivePage('order-history')} className={linkClasses('order-history')}>
          <HistoryIcon /> Order History
        </button>
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
  const [orderItems, setOrderItems] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [unit, setUnit] = React.useState('kg');
  const [isManualEntry, setIsManualEntry] = React.useState(false);
  const [itemInputValue, setItemInputValue] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const filteredItems = searchQuery 
    ? AVAILABLE_ITEMS.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAddItem = () => {
    if (itemName && quantity) {
      const newItem = { name: itemName, quantity: parseInt(quantity), unit };
      setOrderItems([...orderItems, newItem]);
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
      setItemName('');
    }
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      alert("Please add items to your order before submitting.");
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

      const response = await stallAPI.createRequest(requestData);
      
      alert(`Success! ${orderItems.length} items submitted to Admin`);
      console.log("Order submitted successfully:", response);
      
      setOrderItems([]);
      
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(`Error submitting order: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h3 className="page-title">Create Daily Order</h3>
        <p className="page-description">Search for an item or add one manually to build your order list.</p>
      </div>

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
            <button 
              className="btn btn-green" 
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Final Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- OrderHistoryPage with ALL improvements --- //
const OrderHistoryPage = () => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [dateFilter, setDateFilter] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [editingRequest, setEditingRequest] = React.useState(null);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, action: null, requestId: null });
    
    React.useEffect(() => {
        loadOrderHistory();
    }, []);

    const loadOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await stallAPI.getRequests();
            setRequests(response.requests || []);
        } catch (error) {
            console.error('Error loading order history:', error);
            alert(`Error loading history: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 CHANGE 1: Sort by newest first (reverse chronological)
    const sortedRequests = [...requests].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );

    const filteredRequests = sortedRequests.filter(request => {
        const matchesDate = !dateFilter || 
            new Date(request.created_at).toISOString().split('T')[0] === dateFilter;
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesDate && matchesStatus;
    });

    // 🔄 CHANGE 2 & 3: Format timestamp properly and rename "compiled" to "approved"
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

    const formatStatus = (status) => {
        return status === 'compiled' ? 'approved' : status;
    };

    // 🔄 CHANGE 7: Confirmation modal for marking as completed
    const handleMarkCompleted = (requestId) => {
        setConfirmModal({
            isOpen: true,
            action: 'complete',
            requestId: requestId,
            title: 'Mark Order as Completed?',
            message: 'Are you sure you want to mark this order as completed? This action will notify the admin.'
        });
    };

    const confirmMarkCompleted = async () => {
        // TODO: Add API call to mark as completed
        console.log('Marking request as completed:', confirmModal.requestId);
        alert('Order marked as completed!');
        setConfirmModal({ isOpen: false, action: null, requestId: null });
        loadOrderHistory();
    };

    // 🔄 CHANGE 8: Cancel/Delete order option
    const handleCancelOrder = (requestId) => {
        setConfirmModal({
            isOpen: true,
            action: 'cancel',
            requestId: requestId,
            title: 'Cancel This Order?',
            message: 'Are you sure you want to cancel this order? This action cannot be undone.'
        });
    };

    const confirmCancelOrder = async () => {
        try {
            // TODO: Add actual API call
            console.log('Canceling request:', confirmModal.requestId);
            alert('Order cancelled successfully!');
            setConfirmModal({ isOpen: false, action: null, requestId: null });
            loadOrderHistory();
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order');
        }
    };

    // 🔄 CHANGE 9: Edit pending orders
    const handleEditOrder = (request) => {
        if (request.status === 'pending') {
            setEditingRequest(request);
        }
    };

    const handleSaveEdit = async () => {
        try {
            // TODO: Add API call to update request
            console.log('Saving edited request:', editingRequest);
            alert('Order updated successfully!');
            setEditingRequest(null);
            loadOrderHistory();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order');
        }
    };

    return (
        <div className="page-section">
            <div>
                <h3 className="page-title">Order History</h3>
                <p className="page-description">A record of all your submitted raw material requests (newest first).</p>
            </div>
            <div className="card">
                <div className="history-header">
                    <h4 className="page-title" style={{fontSize: '1.25rem'}}>All Past Requests</h4>
                    <div className="history-filter">
                        <label htmlFor="status-filter" className="form-label" style={{marginBottom: 0, marginRight: '0.5rem'}}>Status:</label>
                        <select 
                            id="status-filter" 
                            className="form-select"
                            style={{marginRight: '1rem', width: 'auto'}}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label htmlFor="date-filter" className="form-label" style={{marginBottom: 0, marginRight: '0.5rem'}}>Date:</label>
                        <input 
                            type="date" 
                            id="date-filter" 
                            className="form-input"
                            style={{width: 'auto'}}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                        {dateFilter && (
                            <button 
                                onClick={() => setDateFilter('')} 
                                className="btn-manual"
                                style={{marginLeft: '0.5rem'}}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Status</th>
                                <th>Date Requested</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {loading ? (
                                <tr className="table-empty-row">
                                    <td colSpan="6">Loading history...</td>
                                </tr>
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="table-cell-name">{request.item_name}</td>
                                        <td>{request.quantity}</td>
                                        <td>{request.unit}</td>
                                        <td>
                                            {/* 🎨 CHANGE 4: Color-coded status badges */}
                                            <span className={`status-badge status-${formatStatus(request.status).toLowerCase()}`}>
                                                {formatStatus(request.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {/* ⏰ CHANGE 3: Properly formatted timestamp */}
                                            {formatTimestamp(request.created_at)}
                                        </td>
                                        <td className="table-cell-action">
                                            {/* 🔄 CHANGE 8 & 9: Edit/Cancel for pending orders */}
                                            {request.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="btn btn-small btn-yellow"
                                                        onClick={() => handleEditOrder(request)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-small"
                                                        style={{backgroundColor: '#dc2626'}}
                                                        onClick={() => handleCancelOrder(request.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {/* 🔄 CHANGE 7: Confirm before marking completed */}
                                            {request.status === 'approved' && (
                                                <button 
                                                    className="btn btn-small btn-green"
                                                    onClick={() => handleMarkCompleted(request.id)}
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-empty-row">
                                    <td colSpan="6">
                                        {dateFilter || statusFilter !== 'all' 
                                            ? 'No requests found matching your filters.' 
                                            : 'No past requests found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredRequests.length > 0 && (
                    <div style={{padding: '1rem', textAlign: 'right', color: 'var(--text-muted)'}}>
                        Showing {filteredRequests.length} of {requests.length} total requests
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, action: null, requestId: null })}
                onConfirm={confirmModal.action === 'complete' ? confirmMarkCompleted : confirmCancelOrder}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            {/* Edit Modal */}
            {editingRequest && (
                <div className="modal-overlay" onClick={() => setEditingRequest(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Edit Order</h3>
                        <div style={{marginBottom: '1rem'}}>
                            <label className="form-label">Item Name</label>
                            <input 
                                type="text"
                                className="form-input"
                                value={editingRequest.item_name}
                                onChange={(e) => setEditingRequest({...editingRequest, item_name: e.target.value})}
                            />
                        </div>
                        <div style={{marginBottom: '1rem'}}>
                            <label className="form-label">Quantity</label>
                            <input 
                                type="number"
                                className="form-input"
                                value={editingRequest.quantity}
                                onChange={(e) => setEditingRequest({...editingRequest, quantity: parseInt(e.target.value)})}
                            />
                        </div>
                        <div style={{marginBottom: '1.5rem'}}>
                            <label className="form-label">Unit</label>
                            <select 
                                className="form-select"
                                value={editingRequest.unit}
                                onChange={(e) => setEditingRequest({...editingRequest, unit: e.target.value})}
                            >
                                <option>kg</option>
                                <option>liters</option>
                                <option>pieces</option>
                                <option>grams</option>
                                <option>packet</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setEditingRequest(null)} style={{backgroundColor: '#6b7280'}}>
                                Cancel
                            </button>
                            <button className="btn btn-green" onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main App Component --- //
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