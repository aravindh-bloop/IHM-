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

    if (!userRole) {
      setError('Please select your role');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        role: userRole,
        email: email.trim(),
        password: password,
      };

      // Note: kitchen field is ignored for now as per requirements
      // if (userRole === 'chef') {
      //   credentials.kitchen = kitchen;
      // }

      const result = await login(credentials);

      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userRole && email && password) {
      handleLogin();
    }
  };

  return (
    <div style={{  
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px', // Added padding for smaller screens
      background: 'linear-gradient(135deg, #1e5f74 0%, #2d8ca8 50%, #4db8d8 100%)',
    }}>
      <div className="login-container" style={{
        width: '100%',
        maxWidth: '1200px',
        minHeight: '700px',
        display: 'flex',
        borderRadius: '32px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        overflow: 'hidden', // Ensures content stays within rounded corners
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}>
        {/* Left Branding Panel */}
        <div className="branding-panel" style={{
          flex: 1,
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
        }}>
           <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}>
              <ChefHat style={{ width: '50px', height: '50px', color: 'white' }} />
            </div>
            <h1 style={{  
              fontSize: '56px',  
              fontWeight: 'bold',  
              marginBottom: '12px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}>IHM FUMU</h1>
            <p style={{ color: '#a5f3fc', fontSize: '20px', lineHeight: '1.6' }}>
              Welcome to the Food Unit Management System. Centralize your inventory, streamline operations, and manage your kitchen with efficiency.
            </p>
        </div>

        {/* Right Form Panel */}
        <div className="form-panel" style={{
          flex: 1,
          padding: '60px',
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
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
                }}>
                  {error}
                </div>
              )}

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
            </div>
        </div>
      </div>
      
      <style>{`
        /* --- RESPONSIVENESS --- */
        @media (max-width: 992px) {
          .login-container {
            flex-direction: column;
            min-height: auto;
            max-width: 500px;
          }
          .branding-panel {
            display: none; /* Hide the branding panel on smaller screens to save space */
          }
          .form-panel {
            padding: 40px; /* Reduce padding on smaller screens */
          }
        }

        /* --- KEYFRAME ANIMATIONS --- */
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* --- INPUT PLACEHOLDER STYLING --- */
        input::placeholder { color: rgba(165, 243, 252, 0.7); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}