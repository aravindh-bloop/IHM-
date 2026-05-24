import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { stallAPI } from '../services/api';
import { Plus, Trash2, History, LogOut, ChefHat, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const CAT_LABELS = {
  seafood: 'Seafood',
  vegetables_fruits: 'Veg & Fruits',
  general_provisions: 'Provisions',
};

const CAT_COLORS = {
  seafood: { bg: '#e0f2fe', color: '#0369a1' },
  vegetables_fruits: { bg: '#dcfce7', color: '#15803d' },
  general_provisions: { bg: '#fef3c7', color: '#b45309' },
};

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

    /* Sidebar */
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
      text-align: left;
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
      flex-shrink: 0;
    }

    /* Main Content */
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

    .header-subtitle {
      font-size: var(--text-sm);
      color: var(--text-muted);
      margin-top: var(--spacing-xs);
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

    /* Page Content */
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
      letter-spacing: -0.01em;
    }

    .page-description {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    /* Cards */
    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--glass-shadow);
      border: 1px solid var(--glass-border);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-4px);
    }

    /* Catalog Layout */
    .catalog-layout {
      display: flex;
      gap: var(--spacing-2xl);
      height: 100%;
      align-items: flex-start;
    }
    
    .catalog-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }
    
    .item-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--glass-shadow);
      border: 1px solid var(--glass-border);
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
    }
    
    .item-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
    
    .item-content {
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      flex: 1;
    }
    
    .item-title {
      font-weight: 600;
      font-size: var(--text-base);
      color: var(--text-primary);
      margin: 0;
    }
    
    .item-controls {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .qty-input {
      width: 60px;
      text-align: center;
      padding: 0.5rem;
    }
    
    .cart-sidebar {
      width: 350px;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--glass-shadow);
      border: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      max-height: calc(100vh - 120px);
    }
    
    .cart-items-container {
      flex: 1;
      overflow-y: auto;
      padding-right: var(--spacing-sm);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.4);
    }
    
    .cart-item-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    @media (max-width: 1024px) {
      .catalog-layout {
        flex-direction: column;
      }
      .cart-sidebar {
        width: 100%;
        position: static;
        max-height: none;
      }
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

      .form-grid {
        grid-template-columns: 1fr;
      }

      .card {
        padding: var(--spacing-md);
      }

      .table-container {
        font-size: 0.875rem;
      }

      table {
        font-size: var(--text-xs);
      }

      th, td {
        padding: 0.5rem;
      }
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

    /* Button */
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: var(--border-default);
    }

    .btn-danger {
      background: var(--danger-600);
    }

    .btn-danger:hover {
      background: var(--danger-700);
    }

    /* Table */
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
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--border-default);
    }

    .table td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-light);
      color: var(--text-primary);
    }

    .table tbody tr:hover {
      background: var(--bg-secondary);
    }

    .table-empty {
      text-align: center;
      padding: var(--spacing-3xl) var(--spacing-md);
      color: var(--text-muted);
    }

    /* Status Badge */
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

    .status-completed {
      background: var(--success-50);
      color: var(--success-700);
    }

    .status-rejected {
      background: var(--danger-50);
      color: var(--danger-700);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      max-width: 500px;
      width: 95%;
      box-shadow: var(--shadow-2xl);
    }

    .modal-title {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-lg);
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: flex-end;
      margin-top: var(--spacing-2xl);
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-top: none;
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      max-height: 240px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: var(--shadow-lg);
    }

    .search-result-item {
      padding: var(--spacing-md);
      cursor: pointer;
      transition: background var(--transition-fast);
      border-bottom: 1px solid var(--border-light);
    }

    .search-result-item:hover {
      background: var(--bg-secondary);
      color: var(--primary-600);
    }
  `}</style>
);

// Sidebar Component
const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">FUMU</div>
        <div className="sidebar-subtitle">Chef Portal</div>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activePage === 'create-order' ? 'active' : ''}`}
          onClick={() => setActivePage('create-order')}
        >
          <Plus size={20} />
          Create Order
        </button>
        <button
          className={`sidebar-link ${activePage === 'order-history' ? 'active' : ''}`}
          onClick={() => setActivePage('order-history')}
        >
          <History size={20} />
          Order History
        </button>
      </nav>
    </aside>
  );
};

// Header Component
const Header = ({ kitchen, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <div>
        <div className="header-title">Welcome, Chef</div>
        <div className="header-subtitle">Kitchen: <strong>{kitchen || 'Loading...'}</strong></div>
      </div>
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

// Returns the next 5 working days (Mon-Fri only) starting from tomorrow
const getNext5WorkingDays = () => {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow
  while (days.length < 5) {
    const dow = cursor.getDay(); // 0=Sun, 6=Sat
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

const fmtDateIso = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const fmtDateLabel = (d) =>
  d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

// Create Order Page — 5-day planner
const CreateOrderPage = () => {
  const days = React.useMemo(() => getNext5WorkingDays(), []);
  const [activeDayIdx, setActiveDayIdx] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [catalogStates, setCatalogStates] = React.useState({});
  const [catalogue, setCatalogue] = React.useState([]);
  const [catalogueLoading, setCatalogueLoading] = React.useState(true);
  // dayCarts[i] = [{ name, quantity, unit }]
  const [dayCarts, setDayCarts] = React.useState(() => days.map(() => []));

  React.useEffect(() => {
    stallAPI.getAvailableItems()
      .then(data => setCatalogue(data))
      .catch(() => toast.error('Failed to load item catalogue'))
      .finally(() => setCatalogueLoading(false));
  }, []);

  const filteredItems = catalogue.filter(item =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateState = (itemName, field, value) => {
    setCatalogStates(prev => ({
      ...prev,
      [itemName]: {
        ...(prev[itemName] || { quantity: 1 }),
        [field]: value
      }
    }));
  };

  const handleAddItem = (item) => {
    const defaultUnit = item.unit || 'kg';
    const state = catalogStates[item.item_name] || { quantity: 1, unit: defaultUnit };
    const quantity = parseInt(state.quantity) || 1;
    const unit = state.unit || defaultUnit;

    setDayCarts(prev => {
      const next = prev.map(cart => [...cart]);
      const cart = next[activeDayIdx];
      const existingIdx = cart.findIndex(i => i.name === item.item_name && i.unit === unit);
      if (existingIdx >= 0) {
        cart[existingIdx].quantity += quantity;
      } else {
        cart.push({ name: item.item_name, quantity, unit });
      }
      return next;
    });

    toast.success(`Added ${quantity} ${unit} of ${item.item_name} to ${fmtDateLabel(days[activeDayIdx])}`);

    setCatalogStates(prev => ({
      ...prev,
      [item.item_name]: { quantity: 1, unit }
    }));
  };

  const handleRemoveItem = (dayIdx, indexToRemove) => {
    setDayCarts(prev => prev.map((cart, i) =>
      i === dayIdx ? cart.filter((_, idx) => idx !== indexToRemove) : cart
    ));
  };

  const totalItems = dayCarts.reduce((sum, c) => sum + c.length, 0);
  const emptyDays = dayCarts
    .map((c, i) => (c.length === 0 ? i : -1))
    .filter(i => i !== -1);

  const handleSubmitAll = async () => {
    if (totalItems === 0) {
      toast.error('Please add items to at least one day before submitting.');
      return;
    }
    if (emptyDays.length > 0) {
      const labels = emptyDays.map(i => fmtDateLabel(days[i])).join(', ');
      const ok = window.confirm(
        `These days have no items: ${labels}.\n\nSubmit anyway?`
      );
      if (!ok) return;
    }

    try {
      setIsSubmitting(true);

      const allItems = [];
      dayCarts.forEach((cart, dayIdx) => {
        const dateStr = fmtDateIso(days[dayIdx]);
        cart.forEach(item => {
          allItems.push({
            item_name: item.name,
            quantity: parseInt(item.quantity),
            unit: item.unit,
            required_date: dateStr,
          });
        });
      });

      await stallAPI.createRequest({ items: allItems });

      toast.success(`Submitted ${allItems.length} items across ${5 - emptyDays.length} day(s) to HOD.`);

      setTimeout(() => {
        setDayCarts(days.map(() => []));
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCart = dayCarts[activeDayIdx];

  return (
    <div className="page-section" style={{ height: '100%' }}>
      <div>
        <h1 className="page-title">Plan Next 5 Working Days</h1>
        <p className="page-description">
          Build a separate list for each of the next 5 working days, then submit all together to the HOD.
        </p>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        {days.map((d, i) => {
          const isActive = i === activeDayIdx;
          const count = dayCarts[i].length;
          return (
            <button
              key={i}
              onClick={() => setActiveDayIdx(i)}
              className="btn"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)'
                  : 'var(--bg-secondary)',
                color: isActive ? 'white' : 'var(--text-primary)',
                fontWeight: isActive ? 700 : 500,
                padding: '0.6rem 1rem',
                fontSize: 'var(--text-sm)',
              }}
            >
              Day {i + 1} · {fmtDateLabel(d)}
              {count > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--primary-600)',
                  color: isActive ? 'white' : 'white',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: 'var(--text-xs)',
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="catalog-layout">
        {/* Main Catalog Area */}
        <div className="catalog-main">
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <div className="form-group" style={{ maxWidth: '400px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search catalogue (e.g., Onion, Pomfret, Cardamom...)"
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              {!catalogueLoading && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                  {filteredItems.length} of {catalogue.length} items
                </div>
              )}
            </div>
          </div>

          <div className="catalog-grid">
            {catalogueLoading ? (
              <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                Loading catalogue…
              </div>
            ) : filteredItems.map(item => {
              const defaultUnit = item.unit || 'kg';
              const state = catalogStates[item.item_name] || { quantity: 1, unit: defaultUnit };
              const catStyle = CAT_COLORS[item.vendor_category] || CAT_COLORS.general_provisions;
              return (
                <div key={item.item_name} className="item-card">
                  <div className="item-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                      <h3 className="item-title">{item.item_name}</h3>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        background: catStyle.bg,
                        color: catStyle.color,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {CAT_LABELS[item.vendor_category] || 'Other'}
                      </span>
                    </div>

                    <div className="item-controls">
                      <input
                        type="number"
                        min="1"
                        className="form-input qty-input"
                        value={state.quantity}
                        onChange={(e) => handleUpdateState(item.item_name, 'quantity', e.target.value)}
                      />
                      <select
                        className="form-select"
                        value={state.unit || defaultUnit}
                        onChange={(e) => handleUpdateState(item.item_name, 'unit', e.target.value)}
                        style={{ flex: 1, padding: '0.5rem' }}
                      >
                        <option>kg</option>
                        <option>liters</option>
                        <option>pieces</option>
                        <option>grams</option>
                        <option>packet</option>
                        <option>ml</option>
                        <option>dozen</option>
                        <option>bunch</option>
                      </select>
                    </div>

                    <button
                      className="btn"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                      onClick={() => handleAddItem(item)}
                    >
                      <Plus size={16} />
                      Add to {fmtDateLabel(days[activeDayIdx])}
                    </button>
                  </div>
                </div>
              );
            })}
            {!catalogueLoading && filteredItems.length === 0 && (
              <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                {searchQuery ? `No items found matching "${searchQuery}"` : 'No items in catalogue.'}
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="cart-sidebar">
          <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-light)' }}>
            {fmtDateLabel(days[activeDayIdx])} · {activeCart.length} item(s)
          </h2>

          <div className="cart-items-container">
            {activeCart.length > 0 ? (
              activeCart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{item.name}</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(activeDayIdx, index)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', minHeight: 'auto' }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--spacing-xl) 0', fontSize: 'var(--text-sm)' }}>
                No items for this day yet.
              </div>
            )}
          </div>

          <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)', textAlign: 'center' }}>
              Total across 5 days: <strong>{totalItems}</strong> item(s)
            </div>
            <button
              className="btn"
              onClick={handleSubmitAll}
              disabled={isSubmitting || totalItems === 0}
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%)' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit All 5 Days to HOD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order History Page
const OrderHistoryPage = () => {
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [dateFilter, setDateFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  React.useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stallAPI.getRequests();
      setRequests(response.requests || []);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const sortedRequests = [...requests].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  const filteredRequests = sortedRequests.filter(request => {
    const matchesDate = !dateFilter ||
      new Date(request.created_at).toISOString().split('T')[0] === dateFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesDate && matchesStatus;
  });

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

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Order History</h1>
        <p className="page-description">View all your submitted raw material requests.</p>
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
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="status-filter" className="form-label">Status</label>
            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="date-filter" className="form-label">Date</label>
            <input
              type="date"
              id="date-filter"
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="btn btn-secondary"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Required Date</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-empty">Loading history...</td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td><strong>{request.item_name}</strong></td>
                    <td>{request.quantity}</td>
                    <td>{request.unit}</td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>
                      {request.required_date
                        ? new Date(request.required_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                    <td>
                      <span className={`status-badge status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>
                      {formatTimestamp(request.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty">
                    {dateFilter || statusFilter !== 'all'
                      ? 'No requests found matching your filters.'
                      : 'No past requests found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main ChefDashboard Component
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
