import { useState } from 'react';
import { ChefHat, Shield, Truck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

  // 1. Updated handleLogin to work with a <form>'s onSubmit event
  const handleLogin = async (e) => {
    e.preventDefault(); // <-- This is new: stops the page from reloading
    setError('');

    // Your validation logic is unchanged and correct
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
      background: 'radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Neon glowing circles (styles unchanged) */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(56, 189, 248, 0.2)',
        top: '-100px',
        left: '-100px',
        filter: 'blur(160px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(34, 197, 94, 0.2)',
        bottom: '-100px',
        right: '-100px',
        filter: 'blur(140px)',
        zIndex: 0
      }} />

      {/* Main Card (styles unchanged) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '95%',
        maxWidth: '1000px',
        display: 'flex',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
      }}>
        {/* Branding Panel (styles unchanged) */}
        <div style={{
          flex: 1,
          padding: '60px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            marginBottom: '20px',
            boxShadow: '0 0 25px rgba(56,189,248,0.5)',
          }}>
            <ChefHat size={48} color="white" />
          </div>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            letterSpacing: '2px',
            marginBottom: '12px',
            textShadow: '0 0 25px rgba(56,189,248,0.5)',
          }}>IHM FUMU</h1>
          <p style={{
            fontSize: '18px',
            color: '#bae6fd',
            lineHeight: 1.6,
            maxWidth: '350px',
          }}>
            Welcome to the Food Unit Management System. Streamline kitchen operations with advanced control and precision.
          </p>
        </div>

        {/* Form Panel (styles unchanged, but structure is now a <form>) */}
        <div style={{
          flex: 1,
          padding: '60px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#e0f2fe',
            fontSize: '30px',
            fontWeight: '600',
            marginBottom: '36px',
            textShadow: '0 0 10px rgba(56,189,248,0.4)'
          }}>Login to Your Dashboard</h2>

          {/* Role Buttons (styles unchanged) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { id: 'stall', label: 'Chef', icon: ChefHat },
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'vendor', label: 'Vendor', icon: Truck }
     ].map(({ id, label, icon: Icon }) => (
    <button
      key={id}
      type="button" // <-- Set type to avoid form submission
      onClick={() => { setUserRole(id); if (id !== 'stall') setKitchen(''); setError(''); }}
      style={{
        borderRadius: '14px',
        padding: '16px 0',
        border: userRole === id ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
        background: userRole === id ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.08)',
        color: '#e0f2fe',
        fontWeight: '500',
        fontSize: '15px',
        transition: '0.3s',
        cursor: 'pointer',
        transform: userRole === id ? 'scale(1.05)' : 'scale(1)',
        boxShadow: userRole === id ? '0 0 20px rgba(56,189,248,0.4)' : 'none'
      }}>

      {/* --- ADD THIS LINE BACK --- */}
      <Icon style={{ marginBottom: '6px' }} /> 
      
      <div>{label}</div>
    </button>
  ))}
          </div>

          {/* 2. Replaced divs with a <form> and added onSubmit */}
          <form onSubmit={handleLogin}>
            {/* Chef Kitchen */}
            {userRole === 'stall' && (
              <div>
                {/* 3. Added accessible label */}
                <label htmlFor="kitchen-select" style={visuallyHiddenStyles}>Select Kitchen</label>
                <select
                  id="kitchen-select" // <-- Added id
                  value={kitchen}
                  onChange={(e) => setKitchen(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginBottom: '20px',
                    borderRadius: '10px',
                    background: 'hsla(199, 88%, 22%, 0.86)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Kitchen</option>
                  {kitchens.map(k => <option key={k} value={k}>{k} Kitchen</option>)}
                </select>
              </div>
            )}

            {/* Email */}
            {userRole && (
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <label htmlFor="email-input" style={visuallyHiddenStyles}>Email Address</label>
                <Mail style={{ position: 'absolute', top: '14px', left: '16px', color: '#7dd3fc' }} />
                <input
                  id="email-input" // <-- Added id
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 48px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Password */}
{userRole && (
  <div style={{ position: 'relative', marginBottom: '20px' }}>
    <label htmlFor="password-input" style={visuallyHiddenStyles}>
      Password
    </label>

    {/* Password Icon (left) */}
    <Lock
      style={{
        position: 'absolute',
        top: '14px',
        left: '16px',
        color: '#7dd3fc',
      }}
    />

    {/* Input */}
    <input
      id="password-input"
      type={showPassword ? 'text' : 'password'}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        width: '100%',
        padding: '14px 48px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        outline: 'none',
        WebkitTextfieldDecorationContainer: "none",
    WebkitPasswordToggle: "none"
      }}
    />

    {/* SINGLE Blue Eye Icon (Toggle Button) */}
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
        color: '#60a5fa', // brighter blue
      }}
    >
      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
    </button>
  </div>
)}

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.25)',
                border: '1px solid rgba(239,68,68,0.5)',
                padding: '10px',
                borderRadius: '10px',
                color: 'white',
                textAlign: 'center',
                marginBottom: '16px'
              }}>{error}</div>
            )}

            {/* Button */}
            {userRole && (
              <button
                type="submit" // 4. Changed to type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #06b6d4, #22c55e)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(56,189,248,0.4)',
                  transition: '0.3s',
                  opacity: loading ? 0.5 : 1, // Added disabled style
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}