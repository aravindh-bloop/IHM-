import { useState } from 'react';
import { ChefHat, Shield, Truck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const [userRole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
<<<<<<< HEAD

    if (!userRole) {
      setError('Please select your role');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
=======
    if (!userRole) return setError('Please select your role');
    if (userRole === 'chef' && !kitchen) return setError('Please select your kitchen');
    if (!email || !password) return setError('Please fill in all fields');
>>>>>>> 1e8284c (Loginpage updated)

    setLoading(true);
    try {
<<<<<<< HEAD
      const credentials = {
        role: userRole,
        email: email.trim(),
        password: password,
      };

      // Note: kitchen field is ignored for now as per requirements
      // if (userRole === 'chef') {
      //   credentials.kitchen = kitchen;
      // }

=======
      const credentials = { role: userRole, email: email.trim(), password };
      if (userRole === 'chef') credentials.kitchen = kitchen;
>>>>>>> 1e8284c (Loginpage updated)
      const result = await login(credentials);
      if (!result.success) setError(result.error || 'Login failed. Please try again.');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userRole && email && password) {
      handleLogin();
    }
  };

=======
>>>>>>> 1e8284c (Loginpage updated)
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
      {/* Neon glowing circles */}
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

      {/* Main Card */}
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
        {/* Branding Panel */}
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

        {/* Form Panel */}
        <div style={{
          flex: 1,
          padding: '60px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
<<<<<<< HEAD
            <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '600', marginBottom: '32px', textAlign: 'center' }}>
              Login to Your Account
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Role Selection */}
              <div>
                <label style={{ display: 'block', color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
                  Select Your Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {[
                    { id: 'chef', label: 'Chef', icon: ChefHat },
                    { id: 'admin', label: 'Admin', icon: Shield },
                    { id: 'vendor', label: 'Vendor', icon: Truck }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setUserRole(id);
                        setError('');
                      }}
                      disabled={loading}
                      style={{
                        padding: '20px', // Adjusted padding
                        borderRadius: '16px',
                        transition: 'all 0.3s',
                        background: userRole === id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: userRole === id ? '2px solid white' : '2px solid rgba(255, 255, 255, 0.2)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        transform: userRole === id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: userRole === id ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <Icon style={{ width: '28px', height: '28px', color: userRole === id ? 'white' : '#a5f3fc' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: userRole === id ? 'white' : '#a5f3fc' }}>
                          {label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              {userRole && (
                <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '16px', top: '16px', width: '22px', height: '22px', color: '#a5f3fc' }} />
                    <input
                      type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      onKeyPress={handleKeyPress} placeholder={`${userRole}@ihm.edu`} disabled={loading}
                      style={{
                        width: '100%', padding: '14px 16px 14px 50px', background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '12px', color: 'white',
                        fontSize: '16px', outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              {userRole && (
                <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '16px', top: '16px', width: '22px', height: '22px', color: '#a5f3fc' }} />
                    <input
                      type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onKeyPress={handleKeyPress} placeholder="Enter your password" disabled={loading}
                      style={{
                        width: '100%', padding: '14px 50px', background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '12px', color: 'white',
                        fontSize: '16px', outline: 'none',
                      }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '16px', top: '16px', background: 'none',
                        border: 'none', color: '#a5f3fc', cursor: 'pointer', padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: '22px', height: '22px' }} /> : <Eye style={{ width: '22px', height: '22px' }} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div style={{
                  animation: 'shake 0.4s ease-in-out', background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white', padding: '12px 16px',
                  borderRadius: '12px', fontSize: '14px', textAlign: 'center',
=======
          <h2 style={{
            textAlign: 'center',
            color: '#e0f2fe',
            fontSize: '30px',
            fontWeight: '600',
            marginBottom: '36px',
            textShadow: '0 0 10px rgba(56,189,248,0.4)'
          }}>Login to Your Dashboard</h2>

          {/* Role Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { id: 'chef', label: 'Chef', icon: ChefHat },
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'vendor', label: 'Vendor', icon: Truck }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setUserRole(id); if (id !== 'chef') setKitchen(''); setError(''); }}
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
>>>>>>> 1e8284c (Loginpage updated)
                }}>
                <Icon style={{ marginBottom: '6px' }} />
                <div>{label}</div>
              </button>
            ))}
          </div>

<<<<<<< HEAD
              {/* Login Button */}
              {userRole && (
                <button
                  type="button" onClick={handleLogin}
                  disabled={loading || !email || !password}
                  style={{
                    width: '100%', padding: '18px 24px', background: 'white', color: '#0e7490',
                    borderRadius: '12px', fontWeight: '600', fontSize: '18px', border: 'none',
                    cursor: (loading || !email || !password) ? 'not-allowed' : 'pointer',
                    opacity: (loading || !email || !password) ? 0.5 : 1,
                    transition: 'transform 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '22px', height: '22px', border: '2px solid #0e7490', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '12px',
                      }} />
                      Logging in...
                    </>
                  ) : 'Login to Dashboard'}
                </button>
              )}
=======
          {/* Chef Kitchen */}
          {userRole === 'chef' && (
            <select
  value={kitchen}
  onChange={(e) => {
    setKitchen(e.target.value);
    setError('');
  }}
  disabled={loading}
  style={{
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(15, 23, 42, 0.6)', // dark bluish glass look
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: '#a5f3fc', // cyan text
    fontSize: '16px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backdropFilter: 'blur(12px)',
  }}
>
  <option value="" style={{ background: '#0f172a', color: '#a5f3fc' }}>
    Choose your kitchen
  </option>
  {kitchens.map((k) => (
    <option
      key={k}
      value={k}
      style={{
        background: '#0f172a', // dropdown bg
        color: '#a5f3fc', // text color
      }}
    >
      {k} Kitchen
    </option>
  ))}
</select>

          )}

          {/* Email */}
          {userRole && (
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Mail style={{ position: 'absolute', top: '14px', left: '16px', color: '#7dd3fc' }} />
              <input
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
>>>>>>> 1e8284c (Loginpage updated)
            </div>
          )}

          {/* Password */}
          {userRole && (
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Lock style={{ position: 'absolute', top: '14px', left: '16px', color: '#7dd3fc' }} />
              <input
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
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '14px',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#7dd3fc'
                }}>
                {showPassword ? <EyeOff /> : <Eye />}
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
              onClick={handleLogin}
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
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
