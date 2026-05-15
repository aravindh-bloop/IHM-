import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get current user from the backend (cookie-based auth)
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Not authenticated or session expired
        console.log('Not authenticated:', error.message);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Call the login API - returns 204 on success with auth cookie
      const loginSuccess = await authAPI.login(credentials);
      
      if (!loginSuccess) {
        return { success: false, error: 'Invalid email or password.' };
      }
      
      // Small delay to ensure cookie is set before fetching user
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current user data after successful login
      let userData;
      try {
        userData = await authAPI.getCurrentUser();
      } catch (error) {
        console.error('Failed to fetch user after login:', error);
        // Try logout since login succeeded but we can't get user data
        try {
          await authAPI.logout();
        } catch (e) {
          console.error('Logout after getUserData failure:', e);
        }
        return { success: false, error: 'Login succeeded but failed to load user data. Please try again.' };
      }
      
      // Validate role matches what user selected
      if (userData.role !== credentials.role) {
        // Logout immediately if roles don't match
        await authAPI.logout();
        return { 
          success: false, 
          error: `Invalid credentials for the '${credentials.role}' role`
        };
      }

      // Validate kitchen for stall owners (chefs)
      if (credentials.role === 'stall') {
        if (!userData.kitchen) {
          await authAPI.logout();
          return {
            success: false,
            error: 'No kitchen assigned to your account. Please contact admin.'
          };
        }
        if (userData.kitchen !== credentials.kitchen) {
          await authAPI.logout();
          return {
            success: false,
            error: `You don't belong to ${credentials.kitchen} kitchen.`
          };
        }
      }

      // Use kitchen from database for stall owners
      const userInfo = {
        ...userData,
        kitchen: userData.kitchen,
      };

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Invalid email or password.';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      // Force reload to clear any cached state
      window.location.reload();
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);