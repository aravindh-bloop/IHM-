import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Eye, Plus, Clock, LogOut, Moon, Sun, Package,
  ChevronDown, ChevronRight, Trash2, Edit2, Check, X, Receipt, TrendingUp
} from 'lucide-react';
import { adminAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

const VENDOR_CATEGORIES = [
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegetables_fruits', label: 'Vegetables & Fruits' },
  { value: 'general_provisions', label: 'General Provisions' },
];

const catLabel = (v) => VENDOR_CATEGORIES.find(c => c.value === v)?.label || v;

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
    .sidebar {
      width: 260px;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-md);
      z-index: 10;
    }
    .sidebar-header { padding: var(--spacing-lg); border-bottom: 1px solid var(--glass-border); }
    .sidebar-title { font-size: 1.75rem; font-weight: 700; color: var(--primary-700); margin-bottom: var(--spacing-sm); }
    .sidebar-subtitle { font-size: var(--text-xs); color: var(--text-muted); font-weight: 500; }
    .sidebar-nav { flex: 1; padding: var(--spacing-md); display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .sidebar-link {
      display: flex; align-items: center; gap: var(--spacing-sm);
      padding: var(--spacing-md); color: var(--text-secondary);
      border-radius: var(--radius-lg); cursor: pointer;
      transition: all var(--transition-base); border: none;
      background: none; font-family: var(--font-body);
      font-size: var(--text-sm); font-weight: 500; width: 100%;
    }
    .sidebar-link:hover { background: var(--bg-secondary); color: var(--primary-600); }
    .sidebar-link.active {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: var(--text-inverse); box-shadow: var(--shadow-md);
    }
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; min-width: 0; }
    .header {
      background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur));
      border-bottom: 1px solid var(--glass-border);
      padding: var(--spacing-lg) var(--spacing-2xl);
      display: flex; justify-content: space-between; align-items: center;
      box-shadow: var(--shadow-sm); z-index: 5;
    }
    .header-title { font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); }
    .btn-logout {
      display: flex; align-items: center; gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--danger-500); color: white;
      border: none; border-radius: var(--radius-md);
      cursor: pointer; font-weight: 600; font-size: var(--text-sm);
      transition: all var(--transition-fast);
    }
    .btn-logout:hover { background: var(--danger-600); transform: translateY(-2px); }
    .btn-theme-toggle {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; background: var(--bg-secondary);
      border: 1px solid var(--border-default); border-radius: var(--radius-md);
      cursor: pointer; color: var(--text-secondary); transition: all var(--transition-fast);
    }
    .btn-theme-toggle:hover { background: var(--bg-tertiary); color: var(--primary-600); }
    .page-content { flex: 1; overflow-y: auto; padding: var(--spacing-2xl); min-height: 0; }
    .page-section { display: flex; flex-direction: column; gap: var(--spacing-2xl); }
    .page-title { font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); }
    .page-description { font-size: var(--text-sm); color: var(--text-muted); }
    .card {
      background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius-xl); padding: var(--spacing-2xl);
      box-shadow: var(--glass-shadow); border: 1px solid var(--glass-border);
      animation: fadeIn 0.4s ease-out forwards; transition: all var(--transition-base);
    }
    .form-group { display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .form-label { font-size: var(--text-sm); font-weight: 600; color: var(--text-secondary); }
    .form-input, .form-select {
      padding: 0.75rem 1rem; border: 1px solid var(--border-default);
      border-radius: var(--radius-md); background: var(--bg-primary);
      color: var(--text-primary); font-family: var(--font-body);
      font-size: var(--text-base); transition: all var(--transition-fast);
    }
    .form-input:focus, .form-select:focus {
      outline: none; border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }
    .table-container { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th {
      background: var(--bg-secondary); padding: var(--spacing-md);
      text-align: left; font-weight: 600; font-size: var(--text-xs);
      color: var(--text-secondary); text-transform: uppercase;
      border-bottom: 2px solid var(--border-default);
    }
    .table td { padding: var(--spacing-md); border-bottom: 1px solid var(--border-light); }
    .table tbody tr:hover { background: var(--bg-secondary); }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: var(--spacing-sm); padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white; border: none; border-radius: var(--radius-md);
      cursor: pointer; font-weight: 600; font-size: var(--text-sm);
      transition: all var(--transition-fast); box-shadow: var(--shadow-md);
    }
    .btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-sm { padding: 0.4rem 0.85rem; font-size: var(--text-xs); }
    .btn-success { background: linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%); }
    .btn-danger { background: var(--danger-600); box-shadow: none; }
    .btn-danger:hover { background: var(--danger-700); }
    .btn-ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border-default); box-shadow: none;
    }
    .btn-ghost:hover { background: var(--bg-secondary); color: var(--text-primary); }
    .status-badge {
      display: inline-block; padding: 2px 10px;
      border-radius: var(--radius-full); font-size: var(--text-xs);
      font-weight: 600; text-transform: capitalize;
    }
    .status-pending { background: var(--warning-50); color: var(--warning-700); }
    .status-completed, .status-delivered { background: var(--success-50); color: var(--success-700); }
    .status-cancelled { background: var(--danger-50); color: var(--danger-700); }
    .status-hod_submitted { background: var(--primary-50); color: var(--primary-700); }
    .status-admin_compiled { background: var(--success-50); color: var(--success-700); }
    .status-admin_rejected { background: var(--danger-50); color: var(--danger-700); }
    .status-vendor_confirmed { background: var(--primary-100); color: var(--primary-700); }
    .inline-edit { padding: 4px 8px; border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--bg-primary); color: var(--text-primary); font-size: var(--text-sm); width: 100%; }
    .inline-edit:focus { outline: none; border-color: var(--primary-500); }
    .cat-chip {
      display: inline-block; padding: 2px 8px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600;
    }
    .cat-seafood { background: #e0f2fe; color: #0369a1; }
    .cat-vegetables_fruits { background: #dcfce7; color: #15803d; }
    .cat-general_provisions { background: #fef9c3; color: #854d0e; }
    .net-zero { color: var(--success-600); font-weight: 600; }
    .net-positive { color: var(--danger-600); font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--spacing-md); }
    .section-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    .section-title { font-size: var(--text-xl); font-weight: 600; margin: 0; }
    .empty-state { padding: 3rem; text-align: center; color: var(--text-muted); }
    .order-row-clickable:hover { background: var(--primary-50, var(--bg-tertiary)) !important; }
  `}</style>
);

const Sidebar = ({ activePage, setActivePage }) => {
  const links = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Pending Orders', icon: Eye },
    { id: 'receipt', label: 'Goods Receipt', icon: Check },
    { id: 'history', label: 'Vendor Orders', icon: Clock },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'tracking', label: 'Tracking', icon: TrendingUp },
    { id: 'create-account', label: 'Create Account', icon: Plus },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">FUMU</div>
        <div className="sidebar-subtitle">Admin Portal</div>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`sidebar-link ${activePage === id ? 'active' : ''}`} onClick={() => setActivePage(id)}>
            <Icon size={20} />{label}
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
        <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="btn-logout" onClick={onLogout}><LogOut size={18} />Logout</button>
      </div>
    </header>
  );
};

// ── INVENTORY TAB ─────────────────────────────────────────────────────────────

const InventoryPage = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({ item_name: '', quantity: '', unit: '', vendor_category: 'general_provisions' });
  const [saving, setSaving] = React.useState(false);
  const [seeding, setSeeding] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});
  const [catalogue, setCatalogue] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => { load(); loadCatalogue(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getInventory();
      setItems(data);
    } catch (e) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogue = async () => {
    try {
      const data = await adminAPI.getItemCatalogue();
      setCatalogue(data);
    } catch (_) {}
  };

  const handleSeed = async () => {
    if (!window.confirm(`This will add all ${catalogue.length || 'catalogue'} items to inventory at quantity 0 (existing items are untouched). Proceed?`)) return;
    try {
      setSeeding(true);
      const res = await adminAPI.seedInventory();
      toast.success(`${res.message}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const handleItemNameChange = (value) => {
    setForm(f => ({ ...f, item_name: value }));
    if (value.length < 2) { setSuggestions([]); return; }
    const q = value.toLowerCase();
    const matches = catalogue
      .filter(c => c.item_name.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(matches);
  };

  const selectSuggestion = (s) => {
    setForm({ item_name: s.item_name, unit: s.unit, vendor_category: s.vendor_category, quantity: '' });
    setSuggestions([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.item_name || !form.quantity || !form.unit) { toast.error('Fill all fields'); return; }
    try {
      setSaving(true);
      await adminAPI.upsertInventory({ ...form, quantity: parseFloat(form.quantity) });
      toast.success('Saved!');
      setForm({ item_name: '', quantity: '', unit: '', vendor_category: 'general_provisions' });
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await adminAPI.deleteInventory(id);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error('Error deleting');
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({ item_name: item.item_name, quantity: item.quantity, unit: item.unit, vendor_category: item.vendor_category });
  };

  const saveEdit = async (_item) => {
    try {
      await adminAPI.upsertInventory({ ...editForm, quantity: parseFloat(editForm.quantity) });
      toast.success('Updated');
      setEditId(null);
      load();
    } catch (e) {
      toast.error('Error updating');
    }
  };

  return (
    <div className="page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-description">Manage stock levels. Items here auto-deduct from chef requests.</p>
        </div>
        <button
          className="btn"
          onClick={handleSeed}
          disabled={seeding}
          style={{ background: 'linear-gradient(135deg, var(--accent-600, #7c3aed), var(--accent-700, #6d28d9))', whiteSpace: 'nowrap' }}
        >
          {seeding ? 'Initialising…' : `Initialise Full Catalogue${catalogue.length ? ` (${catalogue.length} items)` : ''}`}
        </button>
      </div>

      <div className="card">
        <h2 className="section-title" style={{ marginBottom: 'var(--spacing-lg)' }}>Add / Update Stock</h2>
        <form onSubmit={handleAdd}>
          <div className="form-grid">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Item Name</label>
              <input
                className="form-input"
                placeholder="Type to search catalogue…"
                value={form.item_name}
                onChange={e => handleItemNameChange(e.target.value)}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  maxHeight: 240, overflowY: 'auto'
                }}>
                  {suggestions.map(s => (
                    <div
                      key={s.item_name}
                      onClick={() => selectSuggestion(s)}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        borderBottom: '1px solid var(--border-light)',
                        fontSize: 'var(--text-sm)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{s.item_name}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.unit}</span>
                        <span className={`cat-chip cat-${s.vendor_category}`} style={{ fontSize: 10 }}>
                          {catLabel(s.vendor_category)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input className="form-input" placeholder="kg / litre / pcs" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor Category</label>
              <select className="form-select" value={form.vendor_category} onChange={e => setForm({ ...form, vendor_category: e.target.value })}>
                {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-success" type="submit" disabled={saving} style={{ marginTop: 'var(--spacing-lg)' }}>
            <Plus size={16} />{saving ? 'Saving…' : 'Add / Update Item'}
          </button>
        </form>
      </div>

      {items.some(i => i.is_low_stock) && (
        <div className="card" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-200)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--danger-700)' }}>
            ⚠ Low Stock ({items.filter(i => i.is_low_stock).length} items)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {items.filter(i => i.is_low_stock).map(i => (
              <span key={i.id} style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 'var(--text-xs)', fontWeight: 600,
                background: 'var(--danger-100)', color: 'var(--danger-700)'
              }}>
                {i.item_name}: {i.quantity} {i.unit} (below {i.low_stock_threshold})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="section-title" style={{ marginBottom: 'var(--spacing-lg)' }}>Current Stock ({items.length} items)</h2>
        {loading ? <div className="empty-state">Loading…</div> : items.length === 0 ? (
          <div className="empty-state">No inventory items yet.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    {editId === item.id ? (
                      <>
                        <td><input className="inline-edit" value={editForm.item_name} onChange={e => setEditForm({ ...editForm, item_name: e.target.value })} /></td>
                        <td><input className="inline-edit" type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} style={{ width: 80 }} /></td>
                        <td><input className="inline-edit" value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })} style={{ width: 70 }} /></td>
                        <td>
                          <select className="inline-edit" value={editForm.vendor_category} onChange={e => setEditForm({ ...editForm, vendor_category: e.target.value })}>
                            {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-success" onClick={() => saveEdit(item)}><Check size={14} /></button>
                          <button className="btn btn-sm btn-ghost" onClick={() => setEditId(null)}><X size={14} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: 500 }}>{item.item_name}</td>
                        <td style={item.is_low_stock ? { color: 'var(--danger-700)', fontWeight: 700 } : undefined}>
                          {item.quantity}{item.is_low_stock ? ' ⚠' : ''}
                        </td>
                        <td>{item.unit}</td>
                        <td><span className={`cat-chip cat-${item.vendor_category}`}>{catLabel(item.vendor_category)}</span></td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── ORDERS TAB ────────────────────────────────────────────────────────────────

const OrdersPage = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [compiling, setCompiling] = React.useState(false);
  const [overrides, setOverrides] = React.useState({});
  const [catOverrides, setCatOverrides] = React.useState({});
  const [saving, setSaving] = React.useState({});

  React.useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPendingOrders();
      setItems(data.items || []);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const saveOverride = async (item) => {
    const payload = {};
    if (overrides[item.id] !== undefined) payload.final_quantity = parseInt(overrides[item.id]);
    if (catOverrides[item.id] !== undefined) payload.vendor_category = catOverrides[item.id];
    if (!Object.keys(payload).length) return;

    setSaving(s => ({ ...s, [item.id]: true }));
    try {
      await adminAPI.editRequest(item.id, payload);
      toast.success('Saved override');
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error saving');
    } finally {
      setSaving(s => ({ ...s, [item.id]: false }));
    }
  };

  const handleCompileDay = async (dateKey) => {
    const label = dateKey === 'unscheduled' ? 'unscheduled items' : `items for ${fmtDateNice(dateKey)}`;
    if (!window.confirm(`Compile ${label} and send to vendors? Inventory will be deducted now.`)) return;
    try {
      setCompiling(true);
      const requiredDate = dateKey === 'unscheduled' ? null : dateKey;
      const result = await adminAPI.compileOrders(requiredDate);
      toast.success(`Sent! ${result.compiled_orders?.length || 0} vendor order(s) created.`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Compile failed');
    } finally {
      setCompiling(false);
    }
  };

  const handleCompileAll = async () => {
    if (!window.confirm('Compile ALL pending days at once? Inventory will be deducted in date order.')) return;
    try {
      setCompiling(true);
      const dateKeys = Object.keys(grouped).sort((a, b) => {
        if (a === 'unscheduled') return 1;
        if (b === 'unscheduled') return -1;
        return a.localeCompare(b);
      });
      let totalVendorOrders = 0;
      for (const dateKey of dateKeys) {
        const requiredDate = dateKey === 'unscheduled' ? null : dateKey;
        const result = await adminAPI.compileOrders(requiredDate);
        totalVendorOrders += result.compiled_orders?.length || 0;
      }
      toast.success(`Sequential compile done. ${totalVendorOrders} vendor order(s) created across ${dateKeys.length} day(s).`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Sequential compile failed');
    } finally {
      setCompiling(false);
    }
  };

  // Group by required_date, then by category
  const grouped = {};
  items.forEach(item => {
    const dateKey = item.required_date || 'unscheduled';
    if (!grouped[dateKey]) grouped[dateKey] = {};
    const cat = catOverrides[item.id] || item.vendor_category;
    if (!grouped[dateKey][cat]) grouped[dateKey][cat] = [];
    grouped[dateKey][cat].push(item);
  });

  const sortedDateKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'unscheduled') return 1;
    if (b === 'unscheduled') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 className="page-title">Pending Orders by Day</h1>
          <p className="page-description">
            Approve one day at a time so inventory deductions stay accurate, or compile all days sequentially.
          </p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-success" onClick={handleCompileAll} disabled={compiling}>
            {compiling ? 'Compiling…' : `Approve All ${sortedDateKeys.length} Day(s) Sequentially`}
          </button>
        )}
      </div>

      {loading ? <div className="card"><div className="empty-state">Loading…</div></div> : items.length === 0 ? (
        <div className="card"><div className="empty-state">No HOD-submitted orders pending.</div></div>
      ) : (
        sortedDateKeys.map(dateKey => {
          const cats = grouped[dateKey];
          const totalItemsForDay = Object.values(cats).reduce((s, arr) => s + arr.length, 0);
          return (
            <div className="card" key={dateKey}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)'
              }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  📅 {dateKey === 'unscheduled' ? 'Unscheduled' : fmtDateNice(dateKey)}
                  <span style={{ marginLeft: 12, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {totalItemsForDay} item(s)
                  </span>
                </h2>
                <button className="btn btn-primary" onClick={() => handleCompileDay(dateKey)} disabled={compiling}>
                  {compiling ? 'Compiling…' : 'Approve This Day'}
                </button>
              </div>

              {Object.entries(cats).map(([cat, catItems]) => (
                <div key={cat} style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <span className={`cat-chip cat-${cat}`} style={{ marginRight: 8 }}>{catLabel(cat)}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {catItems.length} item{catItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Stall</th>
                          <th>Kitchen</th>
                          <th>Item</th>
                          <th>Chef Qty</th>
                          <th>HOD Qty</th>
                          <th>In Stock</th>
                          <th>Net Required</th>
                          <th>Final Qty</th>
                          <th>Category</th>
                          <th>Unit</th>
                          <th>Save</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catItems.map(item => {
                          const finalQty = overrides[item.id] !== undefined ? overrides[item.id] : (item.final_quantity ?? item.net_required);
                          const netReq = item.net_required;
                          return (
                            <tr key={item.id}>
                              <td>{item.stall_name}</td>
                              <td>{item.kitchen}</td>
                              <td style={{ fontWeight: 500 }}>{item.item_name}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{item.chef_quantity}</td>
                              <td>{item.hod_quantity}</td>
                              <td style={{ color: item.in_stock > 0 ? 'var(--success-600)' : 'var(--text-muted)' }}>{item.in_stock}</td>
                              <td>
                                <span className={netReq === 0 ? 'net-zero' : 'net-positive'}>
                                  {netReq === 0 ? '✓ Covered' : netReq}
                                </span>
                              </td>
                              <td>
                                <input
                                  className="inline-edit"
                                  type="number"
                                  min="0"
                                  style={{ width: 70 }}
                                  value={finalQty ?? ''}
                                  onChange={e => setOverrides(o => ({ ...o, [item.id]: e.target.value }))}
                                />
                              </td>
                              <td>
                                <select
                                  className="inline-edit"
                                  value={catOverrides[item.id] || item.vendor_category}
                                  onChange={e => setCatOverrides(o => ({ ...o, [item.id]: e.target.value }))}
                                >
                                  {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                              </td>
                              <td>{item.unit}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-ghost"
                                  onClick={() => saveOverride(item)}
                                  disabled={saving[item.id]}
                                >
                                  {saving[item.id] ? '…' : <Check size={14} />}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

const fmtDateNice = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
};

// ── COMPILED ORDERS TAB ───────────────────────────────────────────────────────

const HistoryPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState('all');

  React.useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCompiledOrders();
      setOrders(data);
    } catch (e) {
      toast.error('Failed to load vendor orders');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const filtered = orders.filter(o => statusFilter === 'all' ? true : o.status === statusFilter);

  // Group by required_date (YYYY-MM-DD) then by vendor_category
  const grouped = React.useMemo(() => {
    const byDate = {};
    for (const o of filtered) {
      const dateKey = o.required_date || 'no-date';
      if (!byDate[dateKey]) byDate[dateKey] = {};
      const cat = o.vendor_category || 'uncategorized';
      if (!byDate[dateKey][cat]) byDate[dateKey][cat] = [];
      byDate[dateKey][cat].push(o);
    }
    // Sort dates descending (most recent first), but 'no-date' last
    const dateKeys = Object.keys(byDate).sort((a, b) => {
      if (a === 'no-date') return 1;
      if (b === 'no-date') return -1;
      return b.localeCompare(a);
    });
    return { byDate, dateKeys };
  }, [filtered]);

  const dateLabel = (key) => {
    if (key === 'no-date') return 'Undated';
    const d = new Date(key);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Compare against today (start of day, local)
  const dayBucket = (key) => {
    if (key === 'no-date') return { label: '', color: 'var(--text-muted)' };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(key); d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return { label: 'Today', color: 'var(--primary-700)' };
    if (diff === 1) return { label: 'Tomorrow', color: 'var(--accent-700, var(--primary-600))' };
    if (diff === -1) return { label: 'Yesterday', color: 'var(--text-muted)' };
    if (diff > 0) return { label: `In ${diff} days`, color: 'var(--primary-600)' };
    return { label: `${-diff} days ago`, color: 'var(--text-muted)' };
  };

  const STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'vendor_confirmed', label: 'Frozen by Vendor' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Vendor Orders</h1>
        <p className="page-description">Orders sent to vendors, grouped by delivery date and category. Click any order to see its items.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STATUS_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={statusFilter === t.id ? 'btn' : 'btn btn-ghost'}
            style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card"><div className="empty-state">Loading…</div></div>
      ) : grouped.dateKeys.length === 0 ? (
        <div className="card"><div className="empty-state">No vendor orders yet.</div></div>
      ) : (
        grouped.dateKeys.map(dateKey => {
          const bucket = dayBucket(dateKey);
          const categories = grouped.byDate[dateKey];
          return (
            <div key={dateKey} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--spacing-md)' }}>
                <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                  {dateLabel(dateKey)}
                </h2>
                {bucket.label && (
                  <span style={{
                    padding: '4px 12px', borderRadius: 999, background: 'var(--bg-secondary)',
                    color: bucket.color, fontSize: 'var(--text-xs)', fontWeight: 700
                  }}>{bucket.label}</span>
                )}
              </div>

              {Object.entries(categories).map(([cat, ordersInCat]) => (
                <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={`cat-chip cat-${cat}`}>{catLabel(cat)}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {ordersInCat.length} order{ordersInCat.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {ordersInCat.map(order => (
                    <div key={order.id} style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden'
                    }}>
                      <div
                        onClick={() => toggle(order.id)}
                        className="order-row-clickable"
                        style={{
                          cursor: 'pointer', padding: 'var(--spacing-md) var(--spacing-lg)',
                          display: 'grid',
                          gridTemplateColumns: '24px 1fr auto auto auto auto',
                          alignItems: 'center', gap: 'var(--spacing-md)',
                          background: 'var(--bg-secondary)',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        {expanded[order.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>
                            {order.vendor_email || 'Unknown vendor'}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            #{order.id.substring(0, 8).toUpperCase()}
                            {order.invoice_number && ` · ${order.invoice_number}`}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'var(--primary-700)',
                          background: 'var(--primary-50, var(--bg-primary))',
                          padding: '4px 10px',
                          borderRadius: 999
                        }}>
                          {expanded[order.id] ? 'Hide' : 'View'} {order.total_items} item{order.total_items === 1 ? '' : 's'}
                        </span>
                        <span style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                          color: order.total_price ? 'var(--success-700)' : 'var(--warning-700)'
                        }}>
                          {order.total_price
                            ? `₹${order.total_price.toFixed(2)}`
                            : 'Awaiting bill'}
                        </span>
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {order.delivered_at
                            ? `Delivered ${new Date(order.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                            : `Sent ${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>

                      {expanded[order.id] && (
                        <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', background: 'var(--bg-primary)' }}>
                          <table className="table" style={{ background: 'transparent' }}>
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Ordered</th>
                                <th>Delivered</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map(item => (
                                <tr key={item.order_id}>
                                  <td>{item.item_name}</td>
                                  <td>{item.total_quantity} {item.unit || ''}</td>
                                  <td style={{ color: item.delivered_quantity > 0 ? 'var(--success-700)' : 'var(--text-muted)' }}>
                                    {item.delivered_quantity != null ? `${item.delivered_quantity} ${item.unit || ''}` : 'Pending'}
                                  </td>
                                  <td>{item.unit_price ? `₹${item.unit_price.toFixed(2)}` : 'Pending'}</td>
                                  <td style={{ fontWeight: 600 }}>
                                    {item.total_price ? `₹${item.total_price.toFixed(2)}` : 'Pending'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

// ── GOODS RECEIPT TAB ─────────────────────────────────────────────────────────

const GoodsReceiptPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState({});
  const [confirming, setConfirming] = React.useState(null);

  React.useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOrdersAwaitingReceipt();
      setOrders(data);
    } catch (e) {
      toast.error('Failed to load orders awaiting receipt');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const handleConfirm = async (order) => {
    const total = order.items.reduce((sum, it) => {
      const qty = it.delivered_quantity ?? it.total_quantity;
      const price = it.unit_price ?? 0;
      return sum + qty * price;
    }, 0);
    if (!window.confirm(
      `Confirm receipt of this order (₹${total.toFixed(2)})? This generates the invoice and restocks inventory.`
    )) return;

    try {
      setConfirming(order.id);
      const res = await adminAPI.confirmReceipt(order.id);
      toast.success(`Receipt confirmed — invoice ${res.invoice_number}, ₹${res.total_price.toFixed(2)}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to confirm receipt');
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Goods Receipt</h1>
        <p className="page-description">
          Orders the vendor has frozen and sent over. Confirm what actually arrived to generate the bill and restock inventory.
        </p>
      </div>

      {loading ? (
        <div className="card"><div className="empty-state">Loading…</div></div>
      ) : orders.length === 0 ? (
        <div className="card"><div className="empty-state">Nothing awaiting confirmation right now.</div></div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`cat-chip cat-${order.vendor_category}`}>{catLabel(order.vendor_category)}</span>
                  <span style={{ fontWeight: 600 }}>{order.vendor_email || 'Unknown vendor'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    #{order.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                {order.required_date && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Was due {new Date(order.required_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => toggle(order.id)} style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                  {expanded[order.id] ? 'Hide items' : 'View items'}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleConfirm(order)}
                  disabled={confirming === order.id}
                  style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}
                >
                  {confirming === order.id ? 'Confirming…' : 'Confirm Receipt & Generate Bill'}
                </button>
              </div>
            </div>

            {expanded[order.id] && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Ordered</th>
                    <th>Delivered</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.order_id}>
                      <td>{item.item_name}</td>
                      <td>{item.total_quantity} {item.unit || ''}</td>
                      <td>{item.delivered_quantity != null ? `${item.delivered_quantity} ${item.unit || ''}` : '—'}</td>
                      <td>{item.unit_price != null ? `₹${item.unit_price.toFixed(2)}` : '—'}</td>
                      <td style={{ fontWeight: 600 }}>{item.total_price != null ? `₹${item.total_price.toFixed(2)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

// ── TRACKING TAB (kitchen-wise / category-wise) ──────────────────────────────

const TrackingPage = () => {
  const [view, setView] = React.useState('weekly');
  const [groupBy, setGroupBy] = React.useState('kitchen');
  const [buckets, setBuckets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { load(); }, [view, groupBy]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getTrackingSummary({ view, group_by: groupBy });
      setBuckets(data.buckets || []);
    } catch (e) {
      toast.error('Failed to load tracking summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Tracking</h1>
        <p className="page-description">Spend and volume on delivered (billed) orders, grouped by kitchen or category.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['daily', 'weekly', 'monthly'].map(v => (
            <button key={v} onClick={() => setView(v)} className={view === v ? 'btn' : 'btn btn-ghost'} style={{ padding: '6px 14px', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['kitchen', 'category'].map(g => (
            <button key={g} onClick={() => setGroupBy(g)} className={groupBy === g ? 'btn' : 'btn btn-ghost'} style={{ padding: '6px 14px', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
              By {g}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? <div className="empty-state">Loading…</div> : buckets.length === 0 ? (
          <div className="empty-state">No delivered orders in this range yet.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>{groupBy === 'kitchen' ? 'Kitchen' : 'Category'}</th>
                  <th>Orders</th>
                  <th>Items</th>
                  <th>Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.bucket_label}</td>
                    <td>
                      {groupBy === 'category'
                        ? <span className={`cat-chip cat-${b.group_key}`}>{catLabel(b.group_key)}</span>
                        : b.group_key}
                    </td>
                    <td>{b.total_orders}</td>
                    <td>{b.total_items}</td>
                    <td style={{ fontWeight: 600, color: 'var(--success-700)' }}>₹{b.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── CREATE ACCOUNT TAB ────────────────────────────────────────────────────────

const CreateAccountPage = () => {
  const [formData, setFormData] = React.useState({
    email: '', password: '', role: 'stall',
    kitchen: '', stall_name: '', vendor_category: ''
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
        return;
      }
      if (formData.role === 'stall' && !formData.kitchen) {
        setMessage({ type: 'error', text: 'Please select a kitchen for Chef role' });
        return;
      }
      if (formData.role === 'vendor' && !formData.vendor_category) {
        setMessage({ type: 'error', text: 'Please select a vendor category' });
        return;
      }

      const userData = { email: formData.email, password: formData.password, role: formData.role };
      if (formData.role === 'stall') { userData.kitchen = formData.kitchen; userData.stall_name = formData.stall_name || formData.kitchen; }
      if (formData.role === 'vendor') { userData.vendor_category = formData.vendor_category; }

      const response = await authAPI.registerUser(userData);
      setMessage({ type: 'success', text: `Account created: ${response.email}` });
      setFormData({ email: '', password: '', role: 'stall', kitchen: '', stall_name: '', vendor_category: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Create Account</h1>
        <p className="page-description">Create accounts for chefs, HODs, vendors, and admins.</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {message.text && (
          <div style={{
            padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            background: message.type === 'success' ? 'var(--success-50)' : 'var(--danger-50)',
            border: `1px solid ${message.type === 'success' ? 'var(--success-200)' : 'var(--danger-200)'}`,
            color: message.type === 'success' ? 'var(--success-700)' : 'var(--danger-700)',
            fontSize: 'var(--text-sm)'
          }}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="user@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} disabled={loading}>
              <option value="stall">Chef (Stall)</option>
              <option value="hod">HOD (Head of Department)</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {formData.role === 'stall' && (
            <>
              <div className="form-group">
                <label className="form-label">Kitchen</label>
                <select className="form-select" value={formData.kitchen} onChange={e => setFormData({ ...formData, kitchen: e.target.value })} required disabled={loading}>
                  <option value="">Select Kitchen</option>
                  <option value="BTK">BTK</option>
                  <option value="ATK">ATK</option>
                  <option value="QTK">QTK</option>
                  <option value="CRAFT">CRAFT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stall Name (optional)</label>
                <input className="form-input" placeholder="Defaults to kitchen" value={formData.stall_name} onChange={e => setFormData({ ...formData, stall_name: e.target.value })} disabled={loading} />
              </div>
            </>
          )}

          {formData.role === 'vendor' && (
            <div className="form-group">
              <label className="form-label">Vendor Category</label>
              <select className="form-select" value={formData.vendor_category} onChange={e => setFormData({ ...formData, vendor_category: e.target.value })} required disabled={loading}>
                <option value="">Select Category</option>
                {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          )}

          <button type="submit" className="btn" disabled={loading}>
            <Plus size={18} />{loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── BILLS TAB ─────────────────────────────────────────────────────────────────

const BillsPage = () => {
  const [view, setView] = React.useState('daily');
  const [groupMode, setGroupMode] = React.useState('category'); // 'category' | 'combined'
  const [vendorCat, setVendorCat] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [buckets, setBuckets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState({});

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getBills({
        view,
        // In combined mode don't filter by category — we want all vendors
        vendor_category: groupMode === 'combined' ? undefined : (vendorCat || undefined),
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setBuckets(data.buckets || []);
    } catch (e) {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, [view, groupMode, vendorCat, startDate, endDate]);

  React.useEffect(() => { load(); }, [load]);

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  // Merge all category buckets for the same period into one combined bill
  const combinedPeriods = React.useMemo(() => {
    const byPeriod = {};
    for (const b of buckets) {
      if (!byPeriod[b.bucket_key]) {
        byPeriod[b.bucket_key] = {
          bucket_key: b.bucket_key,
          bucket_label: b.bucket_label,
          period_start: b.period_start,
          categories: [],
          grand_total: 0,
          total_orders: 0,
          total_items: 0,
        };
      }
      const p = byPeriod[b.bucket_key];
      p.categories.push(b);
      p.grand_total += b.total_price || 0;
      p.total_orders += b.total_orders || 0;
      p.total_items += b.total_items || 0;
    }
    return Object.values(byPeriod).sort((a, b) => b.period_start > a.period_start ? 1 : -1);
  }, [buckets]);

  const grandTotal = buckets.reduce((s, b) => s + (b.total_price || 0), 0);

  const VIEW_TABS = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="page-section">
      <div>
        <h1 className="page-title">Bills</h1>
        <p className="page-description">
          Vendor bills aggregated by day, week, or month.
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'flex-end' }}>

          {/* Period toggle */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Period</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {VIEW_TABS.map(t => (
                <button key={t.id} onClick={() => setView(t.id)}
                  className={view === t.id ? 'btn' : 'btn btn-ghost'}
                  style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group mode toggle */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">View as</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setGroupMode('category')}
                className={groupMode === 'category' ? 'btn' : 'btn btn-ghost'}
                style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                By Vendor
              </button>
              <button onClick={() => setGroupMode('combined')}
                className={groupMode === 'combined' ? 'btn' : 'btn btn-ghost'}
                style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                Combined
              </button>
            </div>
          </div>

          {/* Category filter — only in By Vendor mode */}
          {groupMode === 'category' && (
            <div className="form-group" style={{ flex: '0 0 190px', marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={vendorCat} onChange={e => setVendorCat(e.target.value)}>
                <option value="">All categories</option>
                {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          )}

          <div className="form-group" style={{ flex: '0 0 150px', marginBottom: 0 }}>
            <label className="form-label">From</label>
            <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '0 0 150px', marginBottom: 0 }}>
            <label className="form-label">To</label>
            <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          {(startDate || endDate || vendorCat) && (
            <button className="btn btn-ghost"
              onClick={() => { setStartDate(''); setEndDate(''); setVendorCat(''); }}
              style={{ padding: '8px 14px', fontSize: 'var(--text-sm)', alignSelf: 'flex-end' }}>
              Clear filters
            </button>
          )}
        </div>

        {!loading && buckets.length > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'var(--success-50)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--success-200, var(--border-light))'
          }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {groupMode === 'combined'
                ? `${combinedPeriods.length} period${combinedPeriods.length === 1 ? '' : 's'} · ${buckets.length} vendor bill${buckets.length === 1 ? '' : 's'}`
                : `${buckets.length} bill${buckets.length === 1 ? '' : 's'} in view`}
            </span>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--success-700)' }}>
              Grand Total: ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card"><div className="empty-state">Loading…</div></div>
      ) : buckets.length === 0 ? (
        <div className="card"><div className="empty-state">No bills found for the selected filters.</div></div>
      ) : groupMode === 'category' ? (

        /* ── BY VENDOR VIEW ── */
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Invoice Ref</th>
                  <th>Period</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Orders</th>
                  <th>Items</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map(b => {
                  const key = `${b.bucket_key}-${b.vendor_category}`;
                  return (
                    <React.Fragment key={key}>
                      <tr style={{ cursor: 'pointer' }} onClick={() => toggle(key)}>
                        <td>{expanded[key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-700)' }}>{b.invoice_ref}</td>
                        <td>{b.bucket_label}</td>
                        <td><span className={`cat-chip cat-${b.vendor_category}`}>{catLabel(b.vendor_category)}</span></td>
                        <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{b.vendor_email || '—'}</td>
                        <td>{b.total_orders}</td>
                        <td>{b.total_items}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success-700)' }}>₹{b.total_price.toFixed(2)}</td>
                      </tr>
                      {expanded[key] && (
                        <tr>
                          <td colSpan={8} style={{ padding: '0 var(--spacing-2xl) var(--spacing-lg)' }}>
                            <div style={{ marginTop: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: 'var(--spacing-md)' }}>
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)', fontWeight: 600, textTransform: 'uppercase' }}>
                                {b.constituents.length} invoice{b.constituents.length === 1 ? '' : 's'}
                              </p>
                              <table className="table" style={{ background: 'transparent' }}>
                                <thead><tr><th>Invoice #</th><th>Delivered</th><th>Delivery Date</th><th>Items</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                                <tbody>
                                  {b.constituents.map(c => (
                                    <tr key={c.compiled_order_id}>
                                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.invoice_number || '—'}</td>
                                      <td>{c.delivered_at ? new Date(c.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                      <td>{c.required_date ? new Date(c.required_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</td>
                                      <td>{c.total_items}</td>
                                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{c.total_price.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* ── COMBINED VIEW ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {combinedPeriods.map(period => (
            <div key={period.bucket_key} className="card" style={{ padding: 0, overflow: 'hidden' }}>

              {/* Period header */}
              <div style={{
                padding: 'var(--spacing-lg) var(--spacing-2xl)',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                color: 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{period.bucket_label}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginTop: 2 }}>
                    {period.total_orders} order{period.total_orders === 1 ? '' : 's'} · {period.total_items} item{period.total_items === 1 ? '' : 's'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>Grand Total</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    ₹{period.grand_total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Category breakdown */}
              <div style={{ padding: 'var(--spacing-lg) var(--spacing-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Breakdown by vendor
                </div>

                {period.categories.map(b => {
                  const pct = period.grand_total > 0 ? (b.total_price / period.grand_total) * 100 : 0;
                  const key = `combined-${period.bucket_key}-${b.vendor_category}`;
                  return (
                    <div key={b.vendor_category} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                      <div
                        onClick={() => toggle(key)}
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                          background: 'var(--bg-secondary)'
                        }}
                      >
                        {expanded[key] ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        <span className={`cat-chip cat-${b.vendor_category}`}>{catLabel(b.vendor_category)}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 1 }}>
                          {b.vendor_email || ''} · {b.total_orders} order{b.total_orders === 1 ? '' : 's'} · {b.total_items} item{b.total_items === 1 ? '' : 's'}
                        </span>
                        {/* Share bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 80, height: 6, background: 'var(--border-light)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-500)', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', width: 34, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--success-700)', minWidth: 90, textAlign: 'right' }}>
                          ₹{b.total_price.toFixed(2)}
                        </span>
                      </div>

                      {/* Invoice details per category */}
                      {expanded[key] && (
                        <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', background: 'var(--bg-primary)' }}>
                          <table className="table" style={{ background: 'transparent' }}>
                            <thead><tr><th>Invoice #</th><th>Delivered</th><th>Delivery Date</th><th>Items</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                            <tbody>
                              {b.constituents.map(c => (
                                <tr key={c.compiled_order_id}>
                                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.invoice_number || '—'}</td>
                                  <td>{c.delivered_at ? new Date(c.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                  <td>{c.required_date ? new Date(c.required_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</td>
                                  <td>{c.total_items}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{c.total_price.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Period total row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  borderTop: '2px solid var(--border-default)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Total for {period.bucket_label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--success-700)' }}>
                    ₹{period.grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activePage, setActivePage] = React.useState('orders');
  const { logout } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'inventory': return <InventoryPage />;
      case 'orders': return <OrdersPage />;
      case 'receipt': return <GoodsReceiptPage />;
      case 'history': return <HistoryPage />;
      case 'bills': return <BillsPage />;
      case 'tracking': return <TrackingPage />;
      case 'create-account': return <CreateAccountPage />;
      default: return <OrdersPage />;
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
