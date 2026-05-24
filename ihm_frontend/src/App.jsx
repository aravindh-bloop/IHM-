import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import HODDashboard from './pages/HODDashboard';
import './App.css';

// Polls /api/health until the backend responds, then resolves.
function useBackendWarmup() {
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        const res = await fetch('/api/health', { signal: AbortSignal.timeout(12000) });
        if (res.ok && !cancelled) setReady(true);
        else if (!cancelled) schedule();
      } catch {
        if (!cancelled) schedule();
      }
    };
    const schedule = () => setTimeout(() => {
      if (!cancelled) setAttempt(a => a + 1);
    }, 4000);
    ping();
    return () => { cancelled = true; };
  }, [attempt]);

  // Tick elapsed seconds so the UI can show "still starting…" message
  useEffect(() => {
    if (ready) return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [ready]);

  return { ready, elapsed };
}

const WarmupSplash = ({ elapsed }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: 'white',
    gap: '2rem',
    fontFamily: 'system-ui, sans-serif',
  }}>
    {/* Spinner */}
    <div style={{
      width: 64, height: 64,
      border: '3px solid rgba(255,255,255,0.1)',
      borderTopColor: '#38bdf8',
      borderRadius: '50%',
      animation: 'spin 0.9s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

    {/* Title */}
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        FUMU
      </div>
      <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
        {elapsed < 20 ? 'Starting up the server…' : 'Still warming up, almost there…'}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#475569' }}>
        {elapsed}s elapsed
      </div>
    </div>

    {elapsed >= 45 && (
      <div style={{
        maxWidth: 340, textAlign: 'center', fontSize: '0.8rem',
        color: '#64748b', lineHeight: 1.6,
        padding: '0.75rem 1rem',
        border: '1px solid #1e3a5f',
        borderRadius: '0.75rem',
        background: 'rgba(30,58,95,0.3)',
      }}>
        The server is on a free plan and takes up to 60 seconds to wake up after a period of inactivity.
        This only happens once — everyone else gets instant access after this.
      </div>
    )}
  </div>
);

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const { ready, elapsed } = useBackendWarmup();

  // Block on backend warmup first, then on auth loading
  if (!ready) return <WarmupSplash elapsed={elapsed} />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  switch (user?.role) {
    case 'stall':
      return <ChefDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    case 'hod':
      return <HODDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Unknown role: {user?.role}</p>
            <p className="text-sm text-gray-600 mt-2">Please contact administrator</p>
          </div>
        </div>
      );
  }
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          className: '',
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
          },
        }} />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

