import { createContext, useContext, useState, useEffect } from 'react';
// We can comment out the real API for now, or leave it for later
// import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// --- 1. FAKE API SIMULATION ---
// This function mimics a real backend API call.
const fakeApiLogin = (credentials) => {
  console.log("Fake API received:", credentials);
  // We return a Promise to simulate the asynchronous nature of a network request.
  return new Promise((resolve, reject) => {
    // Simulate a 1.5-second network delay so we can see the loading spinner.
    setTimeout(() => {
      // --- Define our "valid" users here ---
      if (
        (credentials.role === 'chef' && credentials.email === 'chef@ihm.edu' && credentials.password === 'password123') ||
        (credentials.role === 'admin' && credentials.email === 'admin@ihm.edu' && credentials.password === 'password123')
      ) {
        // If credentials are correct, resolve the promise with the expected data structure.
        resolve({
          token: 'fake-jwt-token-for-testing-12345',
          user: {
            id: 'user01',
            name: `Test ${credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)}`,
            email: credentials.email,
            role: credentials.role,
            kitchen: credentials.kitchen || null, // Include kitchen if it exists
          },
        });
      } else {
        // If credentials are wrong, reject the promise with an error object
        // that matches the structure your catch block expects.
        reject({
          response: {
            data: {
              message: 'Invalid email or password.',
            },
          },
        });
      }
    }, 1500);
  });
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This useEffect is perfect, no changes needed here.
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // --- 2. MODIFY THE LOGIN FUNCTION ---
  const login = async (credentials) => {
    try {
      // Comment out the real API call
      // const response = await authAPI.login(credentials);

      // Call our new fake API function instead
      const response = await fakeApiLogin(credentials);
      
      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  // --- 3. (Optional) MODIFY THE LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      // We don't need to call a real logout endpoint for the fake API
      // await authAPI.logout(); 
      console.log("Fake logout successful.");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // The cleanup logic is the most important part and stays the same.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;