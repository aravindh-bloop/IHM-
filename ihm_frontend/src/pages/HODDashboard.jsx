import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ClipboardList, History, LogOut, CheckCircle, XCircle, Plus,
  Moon, Sun, Trash2, Edit3, ChevronDown, ChevronUp, Package, Send
} from 'lucide-react';
import { hodAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

const S = () => (
  <style>{`
    .hod-container { display:flex; height:100vh; background:linear-gradient(-45deg,var(--bg-primary),var(--primary-100),var(--accent-100),var(--bg-secondary)); background-size:400% 400%; animation:gradientMove 15s ease infinite; overflow:hidden; }
    .hod-sidebar { width:280px; background:var(--glass-bg); backdrop-filter:blur(var(--glass-blur)); border-right:1px solid var(--glass-border); display:flex; flex-direction:column; box-shadow:var(--shadow-md); z-index:10; }
    .hod-sidebar-header { padding:var(--spacing-lg); border-bottom:1px solid var(--glass-border); }
    .hod-sidebar-title { font-size:1.75rem; font-weight:700; color:var(--primary-700); margin-bottom:var(--spacing-sm); }
    .hod-sidebar-sub { font-size:var(--text-xs); color:var(--text-muted); font-weight:500; }
    .hod-sidebar-nav { flex:1; padding:var(--spacing-md); display:flex; flex-direction:column; gap:var(--spacing-sm); }
    .hod-nav-btn { display:flex; align-items:center; gap:var(--spacing-sm); padding:var(--spacing-md); color:var(--text-secondary); border-radius:var(--radius-lg); cursor:pointer; transition:all var(--transition-base); border:none; background:none; font-family:var(--font-body); font-size:var(--text-sm); font-weight:500; width:100%; text-align:left; }
    .hod-nav-btn:hover { background:var(--bg-secondary); color:var(--primary-600); }
    .hod-nav-btn.active { background:linear-gradient(135deg,var(--primary-600) 0%,var(--primary-700) 100%); color:var(--text-inverse); box-shadow:var(--shadow-md); }
    .hod-sidebar-footer { padding:var(--spacing-lg); border-top:1px solid var(--glass-border); }
    .hod-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .hod-header { background:var(--glass-bg); backdrop-filter:blur(var(--glass-blur)); border-bottom:1px solid var(--glass-border); padding:var(--spacing-lg) var(--spacing-2xl); display:flex; justify-content:space-between; align-items:center; }
    .hod-header-actions { display:flex; align-items:center; gap:var(--spacing-md); }
    .btn-logout { display:flex; align-items:center; gap:4px; padding:var(--spacing-sm) var(--spacing-lg); background:var(--danger-500); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600; font-size:var(--text-sm); transition:all var(--transition-fast); }
    .btn-logout:hover { background:var(--danger-600); }
    .btn-theme { display:flex; align-items:center; justify-content:center; width:40px; height:40px; background:var(--bg-secondary); border:1px solid var(--border-default); border-radius:var(--radius-md); cursor:pointer; color:var(--text-secondary); transition:all var(--transition-fast); }
    .hod-content { flex:1; overflow-y:auto; padding:var(--spacing-2xl); }
    .hod-section { display:flex; flex-direction:column; gap:var(--spacing-2xl); }
    .page-title { font-size:var(--text-2xl); font-weight:700; color:var(--text-primary); }
    .page-desc { font-size:var(--text-sm); color:var(--text-muted); margin-top:4px; }
    .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:var(--spacing-lg); }
    .stat-box { background:linear-gradient(135deg,rgba(255,255,255,.4) 0%,rgba(255,255,255,.1) 100%); backdrop-filter:blur(var(--glass-blur)); border-radius:var(--radius-lg); padding:var(--spacing-lg); border:1px solid var(--glass-border); }
    .stat-label { font-size:var(--text-xs); font-weight:600; color:var(--text-secondary); text-transform:uppercase; }
    .stat-value { font-size:var(--text-2xl); font-weight:700; color:var(--primary-700); margin-top:4px; }
    .card { background:var(--glass-bg); backdrop-filter:blur(var(--glass-blur)); border-radius:var(--radius-xl); padding:var(--spacing-2xl); box-shadow:var(--glass-shadow); border:1px solid var(--glass-border); }
    .card-title { font-size:var(--text-lg); font-weight:600; color:var(--text-primary); margin-bottom:var(--spacing-lg); display:flex; align-items:center; gap:var(--spacing-sm); }
    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:var(--bg-secondary); padding:var(--spacing-md); text-align:left; font-weight:600; font-size:var(--text-xs); color:var(--text-secondary); text-transform:uppercase; border-bottom:2px solid var(--border-default); }
    td { padding:var(--spacing-md); border-bottom:1px solid var(--border-light); font-size:var(--text-sm); vertical-align:middle; }
    tr:hover td { background:var(--bg-secondary); }
    .inline-input { padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); font-size:var(--text-sm); width:90px; transition:all var(--transition-fast); }
    .inline-input:focus { outline:none; border-color:var(--primary-500); box-shadow:0 0 0 2px var(--primary-100); }
    .inline-input.name-input { width:160px; }
    .inline-input.unit-input { width:70px; }
    .btn-icon { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border:none; border-radius:var(--radius-md); cursor:pointer; transition:all var(--transition-fast); }
    .btn-del { background:var(--danger-100); color:var(--danger-600); }
    .btn-del:hover { background:var(--danger-500); color:white; }
    .btn-edit { background:var(--primary-100); color:var(--primary-600); }
    .btn-edit:hover { background:var(--primary-500); color:white; }
    .btn-save { background:var(--success-100); color:var(--success-700); }
    .btn-save:hover { background:var(--success-500); color:white; }
    .btn-primary { display:flex; align-items:center; gap:6px; padding:10px 20px; background:linear-gradient(135deg,var(--primary-600),var(--primary-700)); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600; font-size:var(--text-sm); transition:all var(--transition-fast); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.15); }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .btn-submit { display:flex; align-items:center; gap:6px; padding:12px 24px; background:linear-gradient(135deg,var(--success-500),var(--success-600)); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:700; font-size:var(--text-base); transition:all var(--transition-fast); }
    .btn-submit:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(34,197,94,.3); }
    .btn-submit:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .add-form { display:grid; grid-template-columns:2fr 1fr 1fr 2fr auto; gap:var(--spacing-sm); align-items:end; padding:var(--spacing-lg); background:var(--bg-secondary); border-radius:var(--radius-lg); margin-top:var(--spacing-lg); }
    .form-group-sm { display:flex; flex-direction:column; gap:4px; }
    .form-label-sm { font-size:var(--text-xs); font-weight:600; color:var(--text-secondary); }
    .form-input-sm { padding:8px 12px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); font-size:var(--text-sm); transition:all var(--transition-fast); }
    .form-input-sm:focus { outline:none; border-color:var(--primary-500); box-shadow:0 0 0 2px var(--primary-100); }
    .form-select-sm { padding:8px 12px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--bg-primary); color:var(--text-primary); font-size:var(--text-sm); }
    .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; }
    .badge-pending { background:var(--warning-100); color:var(--warning-700); }
    .badge-hod_submitted { background:var(--success-100); color:var(--success-700); }
    .badge-admin_compiled { background:var(--primary-100); color:var(--primary-700); }
    .badge-admin_rejected { background:var(--danger-100); color:var(--danger-700); }
    .badge-completed { background:var(--success-100); color:var(--success-700); }
    .kitchen-tag { font-size:11px; background:var(--bg-tertiary); color:var(--text-muted); padding:2px 8px; border-radius:999px; }
    .empty-state { text-align:center; padding:48px 24px; color:var(--text-muted); }
    .empty-state svg { margin:0 auto 16px; opacity:.4; }
    .loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:48px; color:var(--text-muted); }
    .submit-bar { display:flex; align-items:center; justify-content:space-between; padding:var(--spacing-lg) var(--spacing-2xl); background:var(--glass-bg); border-top:1px solid var(--glass-border); }
    .expand-row { cursor:pointer; }
    .sub-row td { background:var(--bg-secondary); font-size:var(--text-xs); color:var(--text-secondary); }
  `}</style>
);

const CATEGORY_LABELS = {
  seafood: 'Seafood',
  vegetables_fruits: 'Vegetables & Fruits',
  general_provisions: 'General Provisions',
};

export default function HODDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState('pending');

  // Pending state
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loadingPending, setLoadingPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stalls, setStalls] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ item_name: '', hod_quantity: '', unit: '', stall_id: '', required_date: '' });

  // History state
  const [history, setHistory] = useState({ raw_requests: [], compiled_orders: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await hodAPI.getPendingRequests();
      setRequests(data.raw_requests || []);
    } catch { toast.error('Failed to load requests'); }
    finally { setLoadingPending(false); }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const data = await hodAPI.getHistory();
      setHistory(data);
    } catch { toast.error('Failed to load history'); }
    finally { setLoadingHistory(false); }
  }, []);

  const fetchStalls = useCallback(async () => {
    try {
      const data = await hodAPI.getStalls();
      setStalls(data);
      if (data.length > 0) setNewItem(p => ({ ...p, stall_id: data[0].id }));
    } catch {}
  }, []);

  useEffect(() => {
    if (tab === 'pending') { fetchPending(); fetchStalls(); }
    else fetchHistory();
  }, [tab]);

  const startEdit = (req) => {
    setEditingId(req.id);
    setEditValues({ item_name: req.item_name, hod_quantity: req.hod_quantity ?? req.quantity, unit: req.unit });
  };

  const saveEdit = async (id) => {
    try {
      await hodAPI.editRequest(id, {
        item_name: editValues.item_name,
        hod_quantity: parseInt(editValues.hod_quantity),
        unit: editValues.unit,
      });
      toast.success('Updated');
      setEditingId(null);
      fetchPending();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Update failed'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Remove this item from the list?')) return;
    try {
      await hodAPI.deleteRequest(id);
      toast.success('Item removed');
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) { toast.error(e?.response?.data?.detail || 'Delete failed'); }
  };

  const addItem = async () => {
    if (!newItem.item_name || !newItem.hod_quantity || !newItem.unit || !newItem.stall_id || !newItem.required_date) {
      toast.error('Fill in all fields including required date'); return;
    }
    try {
      await hodAPI.addItem({ ...newItem, hod_quantity: parseInt(newItem.hod_quantity) });
      toast.success('Item added');
      setNewItem(p => ({ ...p, item_name: '', hod_quantity: '', unit: '' }));
      setShowAddForm(false);
      fetchPending();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Add failed'); }
  };

  // Group pending requests by required_date
  const groupedByDate = React.useMemo(() => {
    const map = new Map();
    requests.forEach(r => {
      const key = r.required_date || 'unscheduled';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === 'unscheduled') return 1;
      if (b === 'unscheduled') return -1;
      return a.localeCompare(b);
    });
  }, [requests]);

  const fmtDateHeader = (iso) => {
    if (iso === 'unscheduled') return 'Unscheduled';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const submitToAdmin = async () => {
    if (requests.length === 0) { toast.error('Nothing to submit'); return; }
    if (!window.confirm(`Submit ${requests.length} item(s) to Admin?`)) return;
    setSubmitting(true);
    try {
      const res = await hodAPI.submitToAdmin();
      toast.success(`${res.submitted_count} items submitted to Admin`);
      setRequests([]);
    } catch (e) { toast.error(e?.response?.data?.detail || 'Submit failed'); }
    finally { setSubmitting(false); }
  };

  const handleLogout = async () => { try { await authAPI.logout(); } finally { logout(); } };

  const statusBadge = (s) => {
    const labels = { pending: 'Pending', hod_submitted: 'Submitted', admin_compiled: 'Compiled', admin_rejected: 'Rejected', completed: 'Completed' };
    return <span className={`badge badge-${s}`}>{labels[s] || s}</span>;
  };

  return (
    <>
      <S />
      <div className="hod-container">
        {/* Sidebar */}
        <aside className="hod-sidebar">
          <div className="hod-sidebar-header">
            <div className="hod-sidebar-title">FUMU</div>
            <div className="hod-sidebar-sub">Head of Department</div>
          </div>
          <nav className="hod-sidebar-nav">
            <button className={`hod-nav-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
              <ClipboardList size={20} /> Pending List
              {requests.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--warning-500)', color: 'white', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                  {requests.length}
                </span>
              )}
            </button>
            <button className={`hod-nav-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
              <History size={20} /> Order History
            </button>
          </nav>
          <div className="hod-sidebar-footer">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Signed in as</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, wordBreak: 'break-all' }}>{user?.email}</div>
          </div>
        </aside>

        {/* Main */}
        <div className="hod-main">
          <header className="hod-header">
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
              {tab === 'pending' ? 'Chef Request List' : 'Order History'}
            </span>
            <div className="hod-header-actions">
              <button className="btn-theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button className="btn-logout" onClick={handleLogout}><LogOut size={16} /> Logout</button>
            </div>
          </header>

          {/* ── PENDING TAB ── */}
          {tab === 'pending' && (
            <>
              <div className="hod-content">
                <div className="hod-section">
                  <div>
                    <h1 className="page-title">Review & Edit Chef Requests</h1>
                    <p className="page-desc">Edit quantities, remove items, or add new ones. Then submit the final list to Admin.</p>
                  </div>

                  <div className="stats-row">
                    <div className="stat-box"><div className="stat-label">Total Items</div><div className="stat-value">{requests.length}</div></div>
                    <div className="stat-box"><div className="stat-label">Kitchens</div><div className="stat-value">{new Set(requests.map(r => r.kitchen)).size}</div></div>
                    <div className="stat-box"><div className="stat-label">Stalls</div><div className="stat-value">{new Set(requests.map(r => r.stall_name)).size}</div></div>
                  </div>

                  <div className="card">
                    <div className="card-title" style={{ justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={20} /> Items from Chefs</span>
                      <button className="btn-primary" onClick={() => setShowAddForm(v => !v)}>
                        <Plus size={16} /> Add Item
                      </button>
                    </div>

                    {showAddForm && (
                      <div className="add-form" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr auto' }}>
                        <div className="form-group-sm">
                          <label className="form-label-sm">Item Name</label>
                          <input className="form-input-sm" placeholder="e.g. Tomatoes" value={newItem.item_name}
                            onChange={e => setNewItem(p => ({ ...p, item_name: e.target.value }))} />
                        </div>
                        <div className="form-group-sm">
                          <label className="form-label-sm">Quantity</label>
                          <input className="form-input-sm" type="number" min="1" placeholder="0" value={newItem.hod_quantity}
                            onChange={e => setNewItem(p => ({ ...p, hod_quantity: e.target.value }))} />
                        </div>
                        <div className="form-group-sm">
                          <label className="form-label-sm">Unit</label>
                          <input className="form-input-sm" placeholder="kg / pcs" value={newItem.unit}
                            onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))} />
                        </div>
                        <div className="form-group-sm">
                          <label className="form-label-sm">Required Date</label>
                          <input className="form-input-sm" type="date" value={newItem.required_date}
                            onChange={e => setNewItem(p => ({ ...p, required_date: e.target.value }))} />
                        </div>
                        <div className="form-group-sm">
                          <label className="form-label-sm">Stall</label>
                          <select className="form-select-sm" value={newItem.stall_id}
                            onChange={e => setNewItem(p => ({ ...p, stall_id: e.target.value }))}>
                            {stalls.map(s => <option key={s.id} value={s.id}>{s.stall_name} ({s.kitchen})</option>)}
                          </select>
                        </div>
                        <button className="btn-primary" style={{ marginTop: 20 }} onClick={addItem}><Plus size={16} />Add</button>
                      </div>
                    )}

                    {loadingPending ? (
                      <div className="loading"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />Loading...</div>
                    ) : requests.length === 0 ? (
                      <div className="empty-state"><CheckCircle size={48} /><p>No pending requests.</p></div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', marginTop: 16 }}>
                        {groupedByDate.map(([dateKey, items]) => (
                          <div key={dateKey} style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            <div style={{
                              padding: 'var(--spacing-md) var(--spacing-lg)',
                              background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              borderBottom: '1px solid var(--glass-border)'
                            }}>
                              <strong style={{ color: 'var(--primary-700)', fontSize: 'var(--text-base)' }}>{fmtDateHeader(dateKey)}</strong>
                              <span className="kitchen-tag">{items.length} item(s)</span>
                            </div>
                            <div className="table-wrap">
                              <table>
                                <thead>
                                  <tr>
                                    <th>Kitchen</th><th>Stall</th><th>Item</th>
                                    <th>Chef Qty</th><th>HOD Qty</th><th>Unit</th><th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map(req => (
                                    <tr key={req.id}>
                                      <td><span className="kitchen-tag">{req.kitchen}</span></td>
                                      <td>{req.stall_name}</td>
                                      <td>
                                        {editingId === req.id
                                          ? <input className="inline-input name-input" value={editValues.item_name}
                                              onChange={e => setEditValues(p => ({ ...p, item_name: e.target.value }))} />
                                          : <strong>{req.item_name}</strong>}
                                      </td>
                                      <td style={{ color: 'var(--text-muted)' }}>{req.quantity}</td>
                                      <td>
                                        {editingId === req.id
                                          ? <input className="inline-input" type="number" min="0" value={editValues.hod_quantity}
                                              onChange={e => setEditValues(p => ({ ...p, hod_quantity: e.target.value }))} />
                                          : <strong style={{ color: 'var(--primary-700)' }}>{req.hod_quantity ?? req.quantity}</strong>}
                                      </td>
                                      <td>
                                        {editingId === req.id
                                          ? <input className="inline-input unit-input" value={editValues.unit}
                                              onChange={e => setEditValues(p => ({ ...p, unit: e.target.value }))} />
                                          : req.unit}
                                      </td>
                                      <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                          {editingId === req.id ? (
                                            <button className="btn-icon btn-save" onClick={() => saveEdit(req.id)} title="Save"><CheckCircle size={15} /></button>
                                          ) : (
                                            <button className="btn-icon btn-edit" onClick={() => startEdit(req)} title="Edit"><Edit3 size={15} /></button>
                                          )}
                                          <button className="btn-icon btn-del" onClick={() => deleteItem(req.id)} title="Remove"><Trash2 size={15} /></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit bar */}
              <div className="submit-bar">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {requests.length > 0 ? `${requests.length} item(s) ready to submit to Admin` : 'No items pending'}
                </span>
                <button className="btn-submit" disabled={requests.length === 0 || submitting} onClick={submitToAdmin}>
                  <Send size={18} /> {submitting ? 'Submitting...' : 'Submit to Admin'}
                </button>
              </div>
            </>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === 'history' && (
            <div className="hod-content">
              <div className="hod-section">
                <div><h1 className="page-title">Order History</h1><p className="page-desc">All submitted requests and compiled vendor orders.</p></div>

                {/* Raw requests history */}
                <div className="card">
                  <div className="card-title"><ClipboardList size={20} /> Raw Material Requests</div>
                  {loadingHistory ? <div className="loading">Loading...</div>
                    : history.raw_requests.length === 0
                      ? <div className="empty-state"><ClipboardList size={48} /><p>No history yet.</p></div>
                      : (
                        <div className="table-wrap">
                          <table>
                            <thead>
                              <tr><th>Kitchen</th><th>Stall</th><th>Item</th><th>Chef</th><th>HOD</th><th>Admin Final</th><th>Unit</th><th>Required</th><th>Status</th><th>Submitted</th></tr>
                            </thead>
                            <tbody>
                              {history.raw_requests.map(r => (
                                <tr key={r.id}>
                                  <td><span className="kitchen-tag">{r.kitchen}</span></td>
                                  <td>{r.stall_name}</td>
                                  <td><strong>{r.item_name}</strong></td>
                                  <td>{r.quantity}</td>
                                  <td style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{r.hod_quantity ?? '—'}</td>
                                  <td style={{ color: 'var(--success-700)', fontWeight: 600 }}>{r.approved_quantity ?? '—'}</td>
                                  <td>{r.unit}</td>
                                  <td style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{r.required_date ? new Date(r.required_date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }) : '—'}</td>
                                  <td>{statusBadge(r.status)}</td>
                                  <td style={{ color: 'var(--text-muted)' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                </div>

                {/* Compiled orders history */}
                <div className="card">
                  <div className="card-title"><Package size={20} /> Compiled Vendor Orders</div>
                  {loadingHistory ? <div className="loading">Loading...</div>
                    : history.compiled_orders.length === 0
                      ? <div className="empty-state"><Package size={48} /><p>No compiled orders yet.</p></div>
                      : (
                        <div className="table-wrap">
                          <table>
                            <thead>
                              <tr><th>Date</th><th>Vendor</th><th>Items</th><th>Total Price</th><th>Status</th><th /></tr>
                            </thead>
                            <tbody>
                              {history.compiled_orders.map(co => (
                                <React.Fragment key={co.id}>
                                  <tr className="expand-row" onClick={() => setExpandedOrder(expandedOrder === co.id ? null : co.id)}>
                                    <td>{co.created_at ? new Date(co.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                    <td><span className="kitchen-tag">{CATEGORY_LABELS[co.vendor_category] || co.vendor_category || '—'}</span></td>
                                    <td>{co.total_items}</td>
                                    <td>{co.total_price != null ? `₹${co.total_price.toFixed(2)}` : '—'}</td>
                                    <td>{statusBadge(co.status)}</td>
                                    <td style={{ color: 'var(--primary-600)' }}>{expandedOrder === co.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                                  </tr>
                                  {expandedOrder === co.id && co.items.map((item, i) => (
                                    <tr key={i} className="sub-row">
                                      <td colSpan={2} />
                                      <td><strong>{item.item_name}</strong></td>
                                      <td>{item.total_quantity} {item.unit}</td>
                                      <td>{item.unit_price != null ? `₹${item.unit_price}/unit` : '—'}</td>
                                      <td>{item.delivered_quantity != null ? `Delivered: ${item.delivered_quantity}` : 'Pending'}</td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
