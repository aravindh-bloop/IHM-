import { useState } from 'react';
import { ChefHat, Shield, Truck, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper object for accessible, hidden labels
const visuallyHiddenStyles = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
};

export default function LoginPage() {
  const { login } = useAuth();

  const [userRole, setUserRole] = useState('');
  const [kitchen, setKitchen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const kitchens = ['BTK', 'ATK', 'QTK', 'CRAFT'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!userRole) return setError('Please select your role');
    if (userRole === 'stall' && !kitchen) return setError('Please select your kitchen');
    if (!email || !password) return setError('Please fill in all fields');

    setLoading(true);
    try {
      const credentials = { role: userRole, email: email.trim(), password };
      if (userRole === 'stall') credentials.kitchen = kitchen;
      const result = await login(credentials);
      if (!result.success) setError(result.error || 'Login failed. Please try again.');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://st4.depositphotos.com/3664757/27559/i/450/depositphotos_275596086-stock-photo-ingredients-making-traditional-italian-pesto.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      overscrollBehavior: 'none',
      padding: 'var(--spacing-xl) 0'
    }}>


      {/* Main container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '95%',
        maxWidth: '1000px',
        display: 'flex',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        backdropFilter: 'blur(10px)',
        border: `1px solid var(--border-light)`,
        boxShadow: `0 0 60px rgba(var(--accent-500), 0.1)`,
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        {/* Branding Panel */}
        <div style={{
          flex: 1,
          padding: 'var(--spacing-2xl)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'var(--bg-tertiary)',
          borderRight: `1px solid var(--border-light)`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-primary)',
            border: `1px solid var(--border-default)`,
            marginBottom: 'var(--spacing-lg)',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 8px 32px rgba(var(--primary-600), 0.1)`
          }}>
            <ChefHat size={40} strokeWidth={1.5} color="currentColor" />
          </div>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--spacing-md)',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
          }}>
            FUMU
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '280px',
            fontWeight: 400
          }}>
            Food Unit Management System. Engineered for precision and speed.
          </p>
        </div>

        {/* Form Panel */}
        <div style={{
          flex: 1,
          padding: 'var(--spacing-2xl)',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{
            textAlign: 'center',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            marginBottom: 'var(--spacing-2xl)',
            letterSpacing: '-0.01em'
          }}>
            Sign In
          </h2>

          {/* Role Selection */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {[
              { id: 'stall', label: 'Chef', icon: ChefHat },
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'vendor', label: 'Vendor', icon: Truck }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setUserRole(id); if (id !== 'stall') setKitchen(''); setError(''); }}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-lg)',
                  border: userRole === id 
                    ? `2px solid var(--accent-500)` 
                    : `1px solid var(--border-light)`,
                  background: userRole === id 
                    ? 'rgba(34, 211, 238, 0.15)' 
                    : 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  backdropFilter: 'blur(10px)',
                  transform: userRole === id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: userRole === id ? `0 0 20px rgba(34, 211, 238, 0.3)` : 'none'
                }}>
                <Icon size={24} strokeWidth={1.5} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Kitchen Selection */}
            {userRole === 'stall' && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="kitchen-select" style={visuallyHiddenStyles}>Select Kitchen</label>
                <select
                  id="kitchen-select"
                  value={kitchen}
                  onChange={(e) => setKitchen(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-default)`,
                    outline: 'none',
                    appearance: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17' viewBox='0 0 12 12'%3E%3Cpath fill='%2322d3ee' d='M6 8.5L1.5 4h9L6 8.5z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: '32px',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  <option value="">Select Kitchen</option>
                  {kitchens.map(k => <option key={k} value={k}>{k} Kitchen</option>)}
                </select>
              </div>
            )}

            {/* Email */}
            {userRole && (
              <div style={{ position: 'relative', marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="email-input" style={visuallyHiddenStyles}>Email Address</label>
                <Mail style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '16px', 
                  color: 'var(--accent-400)',
                  pointerEvents: 'none'
                }} size={20} />
                <input
                  id="email-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 48px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid var(--border-default)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-body)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = `1px solid var(--accent-500)`;
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = `1px solid var(--border-default)`;
                    e.target.style.background = 'var(--bg-primary)';
                  }}
                />
              </div>
            )}

            {/* Password */}
            {userRole && (
              <div style={{ position: 'relative', marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="password-input" style={visuallyHiddenStyles}>Password</label>
                <Lock style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '16px', 
                  color: 'var(--accent-400)',
                  pointerEvents: 'none'
                }} size={20} />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 48px 0.75rem 48px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid var(--border-default)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-body)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = `1px solid var(--accent-500)`;
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = `1px solid var(--border-default)`;
                    e.target.style.background = 'var(--bg-primary)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent-400)',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-300)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-400)'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: `1px solid rgba(239, 68, 68, 0.3)`,
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                textAlign: 'center',
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--text-sm)',
                backdropFilter: 'blur(8px)'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            {userRole && (
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: `var(--primary-600)`,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 'var(--text-base)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: `0 0 30px rgba(34, 211, 238, 0.3)`,
                  transition: 'all var(--transition-fast)',
                  opacity: loading ? 0.6 : 1,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)'
                }}
                onHover={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(34, 211, 238, 0.4)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} strokeWidth={2} />
                    Sign In
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="display: flex"][style*="maxWidth"] {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}